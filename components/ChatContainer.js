import React, { useState, useEffect } from 'react';
import { getMandarinCompletion } from '../services/openaiService';
import { segmentTextJieba } from '../services/jiebaService';
import ChatHeader from './ChatHeader';
import MessageDisplayArea from './MessageDisplayArea';
import ChatInputArea from './ChatInputArea';
import SystemMessages from './SystemMessages';
import TranslationCard from './TranslationCard';
import SituationCard from './SituationCard';
import { getSimpleCompletion } from '../services/openaiService';
import { spaceSegment } from '../services/SegmentService';
import { getTTS } from '../services/openaiService';
import { getCustomCompletion } from '../services/openaiService';

const model = "gpt-3.5-turbo";
const language = "Spanish";
const firstMsgContent = "Say something just one thing to start the conversation. Do not surround your text with quotation marks or a name or anything. Do not ask for any more information on the situation, you should know everything.";

const ChatContainer = () => {
    const [userInput, setUserInput] = useState('');
    const [conversationLog, setConversationLog] = useState([]);
    const [segmentedConversation, setSegmentedConversation] = useState([]);
    const [cardTitle, setCardTitle] = useState('Default Title');
    const [cardContent, setCardContent] = useState('Default content.');
    const [situation, setSituation] = useState('');
    const systemPre = `You are the character Sam in this situation and the user is Bob. Only speak in ${language}. However, if the user asks a question about the language, give them help in English. Keep your responses to 1-2 sentences: `;

    const updateCard = (title, content) => {
        setCardTitle(title);
        setCardContent(content);
    };

    // When situation changes
    useEffect(() => {
        console.log("situation changed: ", situation);
        const processSituation = async () => {
            if (situation === '') {
                return;
            }

            const systemPrompt = systemPre + situation;
            const messages = [{role: 'user', content: firstMsgContent}];
            const openAIResponse = await getCustomCompletion(systemPrompt, messages, model);
            setConversationLog( [{ role: 'assistant', content: openAIResponse }]); // resets convo
        };

        processSituation();
    }, [situation]);

    // Since state updates are asyncronous, we need to use useEffect to wait for the conversationLog state to update
    useEffect(() => {
        const processLatestMessage = async () => {
            if (conversationLog.length == 0) {
                return;
            }

            const lastMessage = conversationLog[conversationLog.length - 1];

            if (lastMessage.role === 'user') {
                // If the last message is from the user, send it to the API
                const systemPrompt = systemPre + situation;
                const openAIResponse = await getCustomCompletion(systemPrompt, conversationLog, model);
                setConversationLog(prev => [...prev, { role: 'assistant', content: openAIResponse }]);
            } else if (lastMessage.role === 'assistant') {
                // If the last message is from the bot, segment the text
                console.log("lastMessage.content: ", lastMessage.content)
                const segmentedResponse = spaceSegment(lastMessage.content);
                console.log("segmentedResponse: ", segmentedResponse)

                setSegmentedConversation(prev => [...prev, { role: 'assistant', content: segmentedResponse }]);
                console.log("conversationLog: ", conversationLog);
                console.log("segmentedConversation: ", segmentedConversation);
                //const openAIResponse = await getTTS('tts-1', 'alloy', lastMessage.content, 'thisid');
            }
        };

        processLatestMessage();
    }, [conversationLog]);

    // When the user submits a message
    const handleSubmit = async (input) => {
        // Update the conversation log immediately with user input
        console.log("HERE HI")
        setSegmentedConversation(prev => [...prev, { role: 'user', content: input }]);
        setConversationLog(prev => [...prev, { role: 'user', content: input }]);
    };

    return (
        <div className="chat-container">
            <ChatHeader />
            <SituationCard content={situation} setSituation={setSituation}/>
            <MessageDisplayArea messages={conversationLog} segmentedMessages={segmentedConversation} onClickWord={updateCard}/>
            <ChatInputArea onSendMessage={handleSubmit} />
            <SystemMessages />
            <TranslationCard title={cardTitle} content={cardContent} onClickWord={updateCard} />
        </div>
    );
};

export default ChatContainer;