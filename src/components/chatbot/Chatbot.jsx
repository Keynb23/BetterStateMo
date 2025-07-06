import { useState, useRef, useEffect, useCallback } from 'react';
import { addContactSubmission } from '../../lib/firestoreService';
import './ChatbotStyles.css';
import { useChatbotData } from './Chatbot-data-context';
import { Minus, MessageSquare, Expand, Minimize2 } from 'lucide-react'; // Import Expand and Minimize2 icons
import ChatButton from './ChatButton';

const Chatbot = () => {
    const knowledgeBase = useChatbotData();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Initialize isChatbotOpen state based on localStorage.
    // If 'chatbot_is_minimized' is 'true' in localStorage, start as closed (false).
    // Otherwise, start as open (true) to allow for the initial delayed pop-up or immediate display.
    const [isChatbotOpen, setIsChatbotOpen] = useState(() => {
        const wasMinimized = localStorage.getItem('chatbot_is_minimized') === 'true';
        return !wasMinimized;
    });

    const [isChatbotExpanded, setIsChatbotExpanded] = useState(false);

    // showChatbot controls the overall visibility of the chatbot container (including the minimized icon).
    // It's initially hidden if it's the very first visit (to allow for the delayed pop-up).
    // Otherwise, it's immediately visible (either open or showing the minimized icon).
    const [showChatbot, setShowChatbot] = useState(() => {
        const hasPoppedUpOnce = localStorage.getItem('chatbot_has_popped_up_once');
        const wasMinimized = localStorage.getItem('chatbot_is_minimized') === 'true';

        // If it has popped up before OR was explicitly minimized, show it immediately.
        // Otherwise, hide it initially for the delayed pop-up on first load.
        return hasPoppedUpOnce === 'true' || wasMinimized;
    });

    const [conversationState, setConversationState] = useState({
        intent: 'initial_load',
        tempData: {},
        currentAction: null,
        confirmationStep: false,
        confirmingType: null,
        faqSubState: null,
        pendingButtons: [],
        isInputEnabled: false,
    });

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Effect to scroll to bottom and focus input when messages or state change
    useEffect(() => {
        if (!isTyping && isChatbotOpen) { // Only scroll if chatbot is open
            scrollToBottom();
        }
        if (!isTyping && isChatbotOpen && conversationState.isInputEnabled && inputRef.current) {
            inputRef.current.focus();
        }
    }, [messages, isTyping, isChatbotOpen, conversationState.isInputEnabled, conversationState.pendingButtons]);

    // Effect for handling initial pop-up behavior on page load
    useEffect(() => {
        const hasPoppedUpOnce = localStorage.getItem('chatbot_has_popped_up_once');
        const wasMinimized = localStorage.getItem('chatbot_is_minimized') === 'true';

        if (!hasPoppedUpOnce && !wasMinimized) {
            // This is the very first time the chatbot is appearing and it wasn't explicitly minimized before.
            // Apply the delayed pop-up.
            const timer = setTimeout(() => {
                setShowChatbot(true); // Make the chatbot container visible
                setIsChatbotOpen(true); // Open the chatbot
                // Display main menu only if it's the very first interaction
                if (messages.length === 0 && conversationState.intent === 'initial_load') {
                    displayMainMenu(true);
                }
                localStorage.setItem('chatbot_has_popped_up_once', 'true'); // Mark that it has popped up
            }, 6000);
            return () => clearTimeout(timer); // Cleanup the timer if component unmounts
        } else if (wasMinimized) {
            // If it was minimized in a previous session, ensure the minimized icon is visible immediately.
            // The initial state of isChatbotOpen already sets it to false, so just ensure visibility.
            setShowChatbot(true);
        } else {
            // If it has popped up once before and was not minimized, just show it immediately open.
            // The initial state of isChatbotOpen already sets it to true, so just ensure visibility.
            setShowChatbot(true);
        }
    }, []); // Empty dependency array means this effect runs only once on mount

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const addBotMessage = useCallback((text, buttons = [], enableInput = false, scrollImmediately = false) => {
        setMessages((prevMessages) => [...prevMessages, { text, sender: 'bot' }]);
        setConversationState((prevState) => ({
            ...prevState,
            pendingButtons: buttons,
            isInputEnabled: enableInput,
        }));
        if (scrollImmediately) {
            setTimeout(scrollToBottom, 50);
        }
    }, []);

    const addUserMessage = useCallback((text) => {
        setMessages((prevMessages) => [...prevMessages, { text, sender: 'user' }]);
        setTimeout(scrollToBottom, 50);
    }, []);

    const displayMainMenu = useCallback((addInitialGreeting = false) => {
        setIsTyping(true);
        setConversationState(prevState => ({ ...prevState, isInputEnabled: false, pendingButtons: [] }));
        setTimeout(() => {
            let initialText = addInitialGreeting ? knowledgeBase.initialGreeting : "What else can I help you with?";
            addBotMessage(initialText, knowledgeBase.mainMenuOptions, false, true);
            setConversationState((prevState) => ({
                ...prevState,
                intent: 'waiting_for_main_menu_selection',
                currentAction: null,
                confirmationStep: false,
                confirmingType: null,
                tempData: {},
                faqSubState: null,
            }));
            setIsTyping(false);
        }, 700);
    }, [addBotMessage, knowledgeBase]);

    const handleConfirmation = async (userMessageText) => {
        const lowerCaseMessage = userMessageText.toLowerCase();
        const yesKeywords = ['yes', 'y', 'yeah', 'sure', 'confirm'];
        const noKeywords = ['no', 'n', 'nah', 'cancel'];

        setIsTyping(true);
        setConversationState(prevState => ({ ...prevState, isInputEnabled: false, pendingButtons: [] }));
        await new Promise(resolve => setTimeout(resolve, 700));

        if (yesKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
            const type = conversationState.confirmingType;
            const dataToSubmit = conversationState.tempData;

            try {
                let successMessage = "";
                if (type === 'contact') {
                    console.log("Submitting contact data:", dataToSubmit);
                    await addContactSubmission(dataToSubmit);
                    successMessage = "Your contact request has been successfully submitted! We will get back to you shortly.";
                }
                addBotMessage(successMessage, [], false, true);
                displayMainMenu();
            } catch (error) {
                console.error(`Error submitting ${type} request:`, error);
                addBotMessage(`I apologize, but there was an error submitting your ${type} request. Please try again later or contact us directly.`, [], false, true);
                displayMainMenu();
            }
        } else if (noKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
            addBotMessage("No worries! The request has been cancelled.", [], false, true);
            displayMainMenu();
        } else {
            addBotMessage("Please confirm with 'Yes' or 'No'.", ['Yes', 'No'], false, true);
        }
        setIsTyping(false);
    };

    const processChatbotResponse = async (userInteraction, isButton = true) => {
        setIsTyping(true);
        setConversationState(prevState => ({ ...prevState, isInputEnabled: false, pendingButtons: [] }));
        await new Promise(resolve => setTimeout(resolve, 500));

        const lowerCaseInteraction = userInteraction.toLowerCase();
        let { intent, tempData, currentAction, confirmationStep, confirmingType, faqSubState } = conversationState;
        let nextBotMessage = "";
        let nextButtons = [];
        let nextIsInputEnabled = false;

        if (lowerCaseInteraction === 'menu') {
            displayMainMenu(true);
            setIsTyping(false);
            return;
        } else if (lowerCaseInteraction === 'bye' || lowerCaseInteraction === 'goodbye') {
            addBotMessage(knowledgeBase.farewell, [], false, true);
            setIsTyping(false);
            return;
        }

        if (confirmationStep) {
            await handleConfirmation(userInteraction);
            setIsTyping(false);
            return;
        }

        if (intent === 'waiting_for_main_menu_selection' && isButton) {
            addUserMessage(userInteraction);
            if (userInteraction === "Contact Request") {
                nextBotMessage = "Okay, let's set up a contact request. What is your full name?";
                intent = 'collecting_contact_name';
                currentAction = 'contact';
                nextIsInputEnabled = true;
            } else if (userInteraction === "Services") {
                nextBotMessage = knowledgeBase.serviceLearnMorePrompt;
                nextButtons = knowledgeBase.serviceOptions;
                intent = 'selecting_service_info';
            } else if (userInteraction === "About Us") {
                nextBotMessage = knowledgeBase.responses.aboutUs;
                nextButtons = knowledgeBase.mainMenuOptions;
                intent = 'waiting_for_main_menu_selection';
            } else if (userInteraction === "Hours") {
                nextBotMessage = knowledgeBase.responses.hours;
                nextButtons = knowledgeBase.mainMenuOptions;
                intent = 'waiting_for_main_menu_selection';
            } else if (userInteraction === "Social Media & Contact Information") {
                nextBotMessage = knowledgeBase.responses.socialMediaContact;
                nextButtons = knowledgeBase.mainMenuOptions;
                intent = 'waiting_for_main_menu_selection';
            } else if (userInteraction === "FAQ") {
                nextBotMessage = knowledgeBase.responses.faqs.initial;
                nextButtons = knowledgeBase.faqMenuOptions;
                faqSubState = 'waiting_for_faq_topic';
                intent = 'general_info';
            } else {
                nextBotMessage = knowledgeBase.defaultResponse;
                nextButtons = knowledgeBase.mainMenuOptions;
                intent = 'waiting_for_main_menu_selection';
            }
        }
        else if (intent === 'selecting_service_info' && isButton) {
            addUserMessage(userInteraction);
            const serviceData = knowledgeBase.serviceDescriptions[userInteraction];
            if (serviceData) {
                nextBotMessage = `${serviceData.description}<br/><br/>${serviceData.averageTime}`;
                nextButtons = knowledgeBase.mainMenuOptions;
                intent = 'waiting_for_main_menu_selection';
            } else {
                nextBotMessage = knowledgeBase.defaultResponse;
                nextButtons = knowledgeBase.serviceOptions;
            }
        }
        else if (faqSubState === 'waiting_for_faq_topic' && isButton) {
            addUserMessage(userInteraction);
            let faqResponse = "";
            if (userInteraction === "Job Lengths") faqResponse = knowledgeBase.responses.faqs.jobLengths;
            else if (userInteraction === "Chemical Safety") faqResponse = knowledgeBase.responses.faqs.chemicalSafety;
            else if (userInteraction === "Equipment Maintenance") faqResponse = knowledgeBase.responses.faqs.equipmentMaintenance;
            else if (userInteraction === "Seasonal Tips") faqResponse = knowledgeBase.responses.faqs.seasonalTips;
            else if (userInteraction === "Veteran Discount") faqResponse = knowledgeBase.responses.faqs.veteranDiscount;

            if (faqResponse) {
                nextBotMessage = faqResponse;
                nextButtons = knowledgeBase.mainMenuOptions;
                faqSubState = null;
                intent = 'waiting_for_main_menu_selection';
            } else {
                nextBotMessage = knowledgeBase.responses.faqs.initial;
                nextButtons = knowledgeBase.faqMenuOptions;
            }
        }
        else if (currentAction === 'contact') {
            if (intent === 'collecting_contact_name') {
                if (!isButton) {
                    addUserMessage(userInteraction);
                    tempData.name = userInteraction;
                    nextBotMessage = "What is the best phone number to reach you?";
                    intent = 'collecting_contact_phone';
                    nextIsInputEnabled = true;
                } else { nextBotMessage = "Please type your full name."; nextIsInputEnabled = true; }
            } else if (intent === 'collecting_contact_phone') {
                if (!isButton) {
                    addUserMessage(userInteraction);
                    tempData.phone = userInteraction;
                    nextBotMessage = "What is your email address?";
                    intent = 'collecting_contact_email';
                    nextIsInputEnabled = true;
                } else { nextBotMessage = "Please type your phone number."; nextIsInputEnabled = true; }
            } else if (intent === 'collecting_contact_email') {
                if (!isButton) {
                    addUserMessage(userInteraction);
                    tempData.email = userInteraction;
                    nextBotMessage = "Please describe why you are requesting to be contacted.";
                    intent = 'collecting_contact_message';
                    nextIsInputEnabled = true;
                } else { nextBotMessage = "Please type your email address."; nextIsInputEnabled = true; }
            } else if (intent === 'collecting_contact_message' && !isButton) {
                addUserMessage(userInteraction);
                tempData.message = userInteraction;
                confirmationStep = true;
                confirmingType = 'contact';
                nextIsInputEnabled = false;

                nextBotMessage = `${knowledgeBase.contactSummaryIntro}<br/>` +
                                 `Name: ${tempData.name}<br/>` +
                                 `Phone: ${tempData.phone}<br/>` +
                                 `Email: ${tempData.email}<br/>` +
                                 `Reason: ${tempData.message}.<br/><br/>` +
                                 knowledgeBase.confirmationPrompt;
                nextButtons = ['Yes', 'No'];
                intent = 'confirm_contact_final';
            } else { nextBotMessage = knowledgeBase.defaultResponse; nextIsInputEnabled = true; }
        }
        else {
            if (!isButton) {
                addUserMessage(userInteraction);
                nextBotMessage = knowledgeBase.defaultResponse;
                nextButtons = knowledgeBase.mainMenuOptions;
                intent = 'waiting_for_main_menu_selection';
                nextIsInputEnabled = false;
            } else {
                nextBotMessage = knowledgeBase.defaultResponse;
                nextButtons = knowledgeBase.mainMenuOptions;
                intent = 'waiting_for_main_menu_selection';
                nextIsInputEnabled = false;
            }
        }

        setConversationState(prevState => ({
            ...prevState,
            intent: intent,
            tempData: tempData,
            currentAction: currentAction,
            confirmationStep: confirmationStep,
            confirmingType: confirmingType,
            faqSubState: faqSubState,
            pendingButtons: nextButtons,
            isInputEnabled: nextIsInputEnabled,
        }));

        if (!confirmationStep) {
            addBotMessage(nextBotMessage, nextButtons, nextIsInputEnabled, true);
        }
        setIsTyping(false);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const userMessageText = input.trim();
        setInput('');

        await processChatbotResponse(userMessageText, false);
    };

    const handleButtonClick = async (label) => {
        setConversationState(prevState => ({ ...prevState, pendingButtons: [], isInputEnabled: false }));
        addUserMessage(label);
        await processChatbotResponse(label, true);
    };

    return (
        <div className={`chatbot-container ${isChatbotOpen ? (isChatbotExpanded ? 'chatbot-expanded' : 'chatbot-open') : 'chatbot-closed'} ${showChatbot ? '' : 'hidden'}`}>
            {/* Show the maximize button only if chatbot is not open and is visible */}
            {!isChatbotOpen && showChatbot && (
                <button className="chatbot-maximize-button" onClick={() => {
                    setIsChatbotOpen(true);
                    localStorage.setItem('chatbot_is_minimized', 'false'); // Save open state to localStorage
                }} aria-label="Open Chatbot">
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Render the full chatbot UI only if it's open */}
            {isChatbotOpen && (
                <>
                    <div className="chat-header">
                        <h2 className="chat-title">Better State Chatbot</h2>
                        <div style={{ display: 'flex', gap: '8px' }}> {/* Container for header buttons */}
                            {isChatbotExpanded ? (
                                <button
                                    className="chat-minimize-button" // Reuse minimize button style
                                    onClick={() => setIsChatbotExpanded(false)}
                                    aria-label="Contract Chatbot"
                                >
                                    <Minimize2 size={20} /> {/* Contract icon */}
                                </button>
                            ) : (
                                <button
                                    className="chat-minimize-button" // Reuse minimize button style
                                    onClick={() => setIsChatbotExpanded(true)}
                                    aria-label="Expand Chatbot"
                                >
                                    <Expand size={20} /> {/* Expand icon */}
                                </button>
                            )}
                            <button className="chat-minimize-button" onClick={() => {
                                setIsChatbotOpen(false);
                                setIsChatbotExpanded(false); // Reset expanded state when minimizing
                                localStorage.setItem('chatbot_is_minimized', 'true'); // Save minimized state to localStorage
                            }} aria-label="Minimize Chatbot">
                                <Minus size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="message-area">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message-bubble-wrapper ${msg.sender === 'user' ? 'user-message-wrapper' : 'bot-message-wrapper'}`}
                            >
                                <div
                                    className={`message-bubble ${
                                        msg.sender === 'user' ? 'user-message' : 'bot-message'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}
                                >
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-bubble-wrapper bot-message-wrapper">
                                <div className="message-bubble bot-message typing-indicator">
                                    <span>Typing...</span>
                                </div>
                            </div>
                        )}
                        {conversationState.pendingButtons.length > 0 && !isTyping && (
                            <div className="button-options-container">
                                {conversationState.pendingButtons.map((buttonLabel, index) => (
                                    <ChatButton
                                        key={index}
                                        label={buttonLabel}
                                        onClick={handleButtonClick}
                                        disabled={isTyping}
                                    />
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="input-form">
                        <div className="input-group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={conversationState.isInputEnabled ? "Type your answer..." : "Click an option above..."}
                                className="input-field"
                                disabled={isTyping || !conversationState.isInputEnabled}
                                ref={inputRef}
                            />
                            <button
                                type="submit"
                                className="send-button"
                                disabled={isTyping || !conversationState.isInputEnabled}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default Chatbot;
