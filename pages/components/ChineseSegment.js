import { useState, useEffect } from 'react';
import styles from "./ChineseSegment.module.css"

function ChineseSegment({ text }) {
    const [segmentedText, setSegmentedText] = useState([]);
    const [segmentMapping, setSegmentMapping] = useState({});

    useEffect(() => {
        const loadJieba = async () => {
            await loadScript("https://pulipulichen.github.io/jieba-js/jquery.js");
            await loadScript("https://pulipulichen.github.io/jieba-js/require-jieba-js.js");
            
            if (window.call_jieba_cut) {
                window.call_jieba_cut(text, async (result) => {
                    const newTranslations = await getTranslations(result);
                    setSegmentedText(result);
                    setSegmentMapping(prevMapping => ({ ...prevMapping, ...newTranslations }));
                });
            }
        };
        
        loadJieba();
    }, [text]);

    async function callTranslate(text) {
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: text }),
            });
    
            const data = await response.json();
    
            if (response.status !== 200 || !data.result) {
                throw new Error(`Request failed with status ${response.status}`);
            }
    
            return data;
    
        } catch (error) {
            console.error(error);
            // If there's an error, return a default value
            return {
                result: "Translation Error"
            };
        }
    }
    

    
      async function getTranslations(segments) {
        const localTranslations = {
            "你": "You",
            "好": "Good",
            "我": "I",
            "是": "Is",
            "不": "Not",
            "吃": "Eat",
            "喝": "Drink",
            "去": "Go",
            "来": "Come",
            "看": "See",
            "听": "Listen",
            "有": "Have",
            "要": "Want",
            "爱": "Love",
            "人": "Person",
            "在": "In",
            "上": "On",
            "下": "Under",
            "这": "This",
            "那": "That",
            "日": "Day",
            "月": "Month",
            "年": "Year",
            "大": "Big",
            "小": "Small",
            "多": "Many",
            "少": "Few",
            "和": "And",
            "水": "Water",
            "火": "Fire",
            "山": "Mountain",
            "风": "Wind",
            "雨": "Rain",
            "书": "Book",
            "天": "Sky",
            "地": "Ground",
            "家": "Home",
            "话": "Word/Talk",
            "车": "Car",
            "门": "Door",
            "桌": "Table",
            "椅": "Chair",
            "手机": "Cellphone",
            "电脑": "Computer",
            "朋友": "Friend",
            "食物": "Food",
            "学习": "Study",
            "工作": "Work",
            "玩": "Play",
            "今": "Today",
            "明": "Tomorrow",
            "昨": "Yesterday",
            "男": "Male",
            "女": "Female",
            "老": "Old",
            "新": "New",
            "前": "Before",
            "后": "After",
            "快": "Fast",
            "慢": "Slow",
            "现在": "Now",
            "时间": "Time",
            "钟": "Clock",
            "时": "Hour",
            "分": "Minute",
            "果": "Fruit",
            "苹果": "Apple",
            "橙子": "Orange",
            "香蕉": "Banana",
            "草莓": "Strawberry",
            "葡萄": "Grape",
            "米饭": "Rice",
            "面条": "Noodles",
            "牛肉": "Beef",
            "鱼": "Fish",
            "鸡": "Chicken",
            "猫": "Cat",
            "狗": "Dog",
            "鸟": "Bird",
            "花": "Flower",
            "树": "Tree",
            "红": "Red",
            "蓝": "Blue",
            "绿": "Green",
            "黄": "Yellow",
            "黑": "Black",
            "白": "White",
            // ... 
        };
        
        
    
        const results = {};
    
        for (const segment of segments) {
            if (localTranslations[segment]) {
                results[segment] = localTranslations[segment];
            } else {
                // Fetch from the API for segments not in local translations.
                results[segment] = (await callTranslate(segment)).result;
            }
        }
        return results;
    }
    

    return (
        <span className={styles.segmentedText}>
            {segmentedText.map((segment, idx) => (
                <span key={segment} className={styles.character} data-tooltip={segmentMapping[segment]}>
                    {segment}
                </span>
            ))}
        </span>
    );
}


function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

export default ChineseSegment;
