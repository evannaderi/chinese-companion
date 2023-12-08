import ChatMessage from "./ChatMessage";
import SegmentedChatMessage from "./SegmentedChatMessage";

const MessageDisplayArea = ({ messages, segmentedMessages, onClickWord }) => {
    return (
        <div className="message-display-area">
            {messages.map((message, index) => {
                if (index < segmentedMessages.length) {
                    return <SegmentedChatMessage key={index} message={segmentedMessages[index]} onClickWord={onClickWord} idx={index} />;
                } else {
                    return <ChatMessage key={index} message={message} />;
                }
            }
            )}
        </div>
    );
};

export default MessageDisplayArea;