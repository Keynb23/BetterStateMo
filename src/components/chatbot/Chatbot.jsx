import { useState, useRef, useEffect } from 'react';
import { addQuoteRequest, addContactSubmission, addAppointment } from '../../lib/firestoreService';
import './ChatbotStyles.css';
import { useChatbotData } from './Chatbot-data-context';
import { Minus, MessageSquare } from 'lucide-react';

const Chatbot = () => {
  const knowledgeBase = useChatbotData();

  const [messages, setMessages] = useState([
    { text: knowledgeBase.initialGreeting, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Change 1: Initialize isChatbotOpen to false
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Changed to false
  const [showChatbot, setShowChatbot] = useState(false);
  const [conversationState, setConversationState] = useState({
    intent: 'waiting_for_first_message',
    tempData: {},
    lastBotMessage: knowledgeBase.initialGreeting,
    currentAction: null,
    confirmationStep: false,
    confirmingType: null,
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Effect to scroll to the latest message and focus the input field
  useEffect(() => {
    scrollToBottom();
    if (!isTyping && isChatbotOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isTyping, isChatbotOpen]);

  // Effect to delay chatbot appearance and then open it
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatbot(true); // Make the chatbot container visible
      setIsChatbotOpen(true); // Change 2: Open the chatbot after the delay
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, []);

  // Helper function to scroll to the bottom of the message area
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper function to add a bot message to the chat
  const addBotMessage = (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender: 'bot' }]);
    setConversationState((prevState) => ({ ...prevState, lastBotMessage: text }));
  };

  // Helper function to add a user message to the chat
  const addUserMessage = (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender: 'user' }]);
  };

  // Handles 'Yes'/'No' confirmations during data submission flows
  const handleConfirmation = async (userMessageText) => {
    const lowerCaseMessage = userMessageText.toLowerCase();
    const yesKeywords = ['yes', 'y', 'yeah', 'sure', 'i guess so'];
    const noKeywords = ['no', 'n', 'nah', 'im good', 'never', 'not a chance', 'nope'];
    let messageForBot = "";

    if (yesKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      const type = conversationState.confirmingType;
      const dataToSubmit = conversationState.tempData;

      try {
        if (type === 'appointment') {
          const appointmentData = {
            name: dataToSubmit.name,
            phone: dataToSubmit.phone,
            email: dataToSubmit.email,
            address: dataToSubmit.address,
            timeOfDay: dataToSubmit.timeOfDay,
            urgency: dataToSubmit.urgency,
            message: dataToSubmit.message || 'No specific message provided.',
          };
          await addAppointment(appointmentData);
          messageForBot = "Your appointment request has been successfully submitted! We will confirm the details with you shortly. Is there anything else I can help you with?";
        } else if (type === 'quote') {
          await addQuoteRequest(dataToSubmit);
          messageForBot = "Your quote request has been successfully submitted! We will get back to you shortly. Is there anything else I can help you with?";
        } else if (type === 'contact') {
          await addContactSubmission(dataToSubmit);
          messageForBot = "Your contact request has been successfully submitted! We will get back to you shortly. Is there anything else I can help you with?";
        }
        setConversationState({
          intent: 'waiting_for_first_message',
          tempData: {},
          lastBotMessage: messageForBot,
          currentAction: null,
          confirmationStep: false,
          confirmingType: null,
        });
      } catch (error) {
        console.error(`Error submitting ${type} request:`, error);
        messageForBot = `I apologize, but there was an error submitting your ${type} request. Please try again later or contact us directly. Is there anything else I can help you with?`;
        setConversationState({
          intent: 'waiting_for_first_message',
          tempData: {},
          lastBotMessage: messageForBot,
          currentAction: null,
          confirmationStep: false,
          confirmingType: null,
        });
      }
    } else if (noKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      messageForBot = "No worries! Let me know if you need anything else!";
      setConversationState({
        intent: 'waiting_for_first_message',
        tempData: {},
        lastBotMessage: messageForBot,
        currentAction: null,
        confirmationStep: false,
        confirmingType: null,
      });
    } else {
      messageForBot = "Please respond with 'Yes' or 'No' to confirm.";
      setConversationState(prevState => ({
        ...prevState,
        lastBotMessage: messageForBot,
      }));
    }
    setIsTyping(false);
  };

  // Main function to process user messages and determine bot's response
  const processChatbotResponse = async (userMessageText) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 700));

    const lowerCaseMessage = userMessageText.toLowerCase();
    let nextBotMessage = "";
    let nextIntent = conversationState.intent;
    let nextTempData = { ...conversationState.tempData };
    let nextAction = conversationState.currentAction;
    let nextConfirmationStep = conversationState.confirmationStep;
    let nextConfirmingType = conversationState.confirmingType;

    if (nextConfirmationStep) {
      await handleConfirmation(userMessageText);
      setIsTyping(false);
      return;
    }

    const keywords = {
      appointment: ['schedule', 'scheduling', 'appointments', 'appointment'],
      quote: ['quote', 'cost', 'price'],
      contact: ['talk to manager', 'talk to owner', 'contact', 'reach out'],
      services: ['pool', 'pool service', 'pool cleaning', 'cleaning', 'service'],
      hours: ['hours', 'business hours'],
      jobLengths: ['job lengths', 'how long', 'length of jobs'],
      safetyTips: ['safety', 'safety tips', 'chemicals safe', 'chemicals safe for pets'],
      equipmentMaintenance: ['equipment', 'maintenance'],
      seasonalTips: ['seasonal', 'winterize', 'summerize'],
      ownerInfo: ["who's the owner", "owner"],
      veteranDiscount: ["veteran discount", "military discount", "discount"],
    };

    if (conversationState.intent === 'waiting_for_first_message' || conversationState.intent === 'general_info') {
      if (keywords.appointment.some(k => lowerCaseMessage.includes(k))) {
        nextAction = 'appointment';
        nextIntent = 'confirm_appointment_start';
        nextBotMessage = "You want to schedule an appointment, correct? (Y/N)";
      } else if (keywords.quote.some(k => lowerCaseMessage.includes(k))) {
        nextAction = 'quote';
        nextIntent = 'confirm_quote_start';
        nextBotMessage = "It sounds like you're interested in a quote. Is that right? (Y/N)";
      } else if (keywords.contact.some(k => lowerCaseMessage.includes(k))) {
        nextAction = 'contact';
        nextIntent = 'confirm_contact_start';
        nextBotMessage = "You'd like to send a contact request. Is that correct? (Y/N)";
      } else if (keywords.ownerInfo.some(k => lowerCaseMessage.includes(k))) {
        nextBotMessage = knowledgeBase.owner_info;
        nextIntent = 'general_info';
      } else if (keywords.safetyTips.some(k => lowerCaseMessage.includes(k))) {
        nextBotMessage = knowledgeBase.chemical_safety;
        nextIntent = 'general_info';
      } else if (keywords.veteranDiscount.some(k => lowerCaseMessage.includes(k))) {
        nextBotMessage = knowledgeBase.veteran_discount;
        nextIntent = 'general_info';
      } else if (keywords.services.some(k => lowerCaseMessage.includes(k))) {
        nextBotMessage = knowledgeBase.services;
        nextIntent = 'general_info';
      } else if (keywords.hours.some(k => lowerCaseMessage.includes(k))) {
        nextBotMessage = knowledgeBase.hours;
        nextIntent = 'general_info';
      } else if (keywords.jobLengths.some(k => lowerCaseMessage.includes(k))) {
        nextBotMessage = knowledgeBase['job lengths'];
        nextIntent = 'general_info';
      } else if (keywords.equipmentMaintenance.some(k => lowerCaseMessage.includes(k))) {
        nextBotMessage = knowledgeBase['equipment maintenance'];
        nextIntent = 'general_info';
      } else if (keywords.seasonalTips.some(k => lowerCaseMessage.includes(k))) {
        nextBotMessage = knowledgeBase['seasonal tips'];
        nextIntent = 'general_info';
      } else if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('goodbye')) {
        nextBotMessage = "Goodbye! Have a great day!";
        nextIntent = 'completed';
      } else {
        nextBotMessage = knowledgeBase.default;
        nextIntent = 'general_info';
      }
    }

    if (nextAction === 'appointment') {
      if (nextIntent === 'confirm_appointment_start') {
        const yesKeywords = ['yes', 'y', 'yeah', 'sure', 'i guess so'];
        const noKeywords = ['no', 'n', 'nah', 'im good', 'never', 'not a chance', 'nope'];
        if (yesKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
          nextIntent = 'collecting_appointment_name';
          nextBotMessage = "Great! What is your full name?";
        } else if (noKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
          nextBotMessage = "No worries! Let me know if you need anything else!";
          nextAction = null;
          nextIntent = 'waiting_for_first_message';
        } else {
          nextBotMessage = "Please respond with 'Yes' or 'No' to confirm.";
        }
      } else if (nextIntent === 'collecting_appointment_name') {
        nextTempData.name = userMessageText;
        nextIntent = 'collecting_appointment_phone';
        nextBotMessage = "What is the best phone number to reach you?";
      } else if (nextIntent === 'collecting_appointment_phone') {
        nextTempData.phone = userMessageText;
        nextIntent = 'collecting_appointment_email';
        nextBotMessage = "What is your email address?";
      } else if (nextIntent === 'collecting_appointment_email') {
        nextTempData.email = userMessageText;
        nextIntent = 'collecting_appointment_address';
        nextBotMessage = "Please provide the address for the appointment.";
      } else if (nextIntent === 'collecting_appointment_address') {
        nextTempData.address = userMessageText;
        nextIntent = 'collecting_appointment_time_of_day';
        nextBotMessage = "What time of day works best for your appointment? (Morning, Noon, or Evening)";
      } else if (nextIntent === 'collecting_appointment_time_of_day') {
        const validTimes = ['morning', 'noon', 'evening', 'anytime'];
        if (validTimes.some(t => lowerCaseMessage.includes(t))) {
          nextTempData.timeOfDay = userMessageText;
          nextIntent = 'collecting_appointment_urgency';
          nextBotMessage = "How soon would you like the appointment? (1-2 weeks, 1 month, 3 months, Not sure yet, or 'Anytime works for me')";
        } else {
          nextBotMessage = "Please choose from 'Morning', 'Noon', 'Evening', or 'Anytime'.";
        }
      } else if (nextIntent === 'collecting_appointment_urgency') {
        nextTempData.urgency = userMessageText;
        nextIntent = 'collecting_appointment_message';
        nextBotMessage = `Any additional details or specific services for the appointment?`;
      } else if (nextIntent === 'collecting_appointment_message') {
        nextTempData.message = userMessageText;
        nextIntent = 'confirm_appointment_final';
        nextConfirmationStep = true;
        nextConfirmingType = 'appointment';
        nextBotMessage = `Okay, I have an appointment request for ${nextTempData.name} at ${nextTempData.address}. Phone: ${nextTempData.phone}, Email: ${nextTempData.email}. Preferred time: ${nextTempData.timeOfDay}, Urgency: ${nextTempData.urgency}. Message: ${nextTempData.message || 'N/A'}. Does this look correct? (Yes/No)`;
      }
    } else if (nextAction === 'quote') {
      if (nextIntent === 'confirm_quote_start') {
        const yesKeywords = ['yes', 'y', 'yeah', 'sure', 'i guess so'];
        const noKeywords = ['no', 'n', 'nah', 'im good', 'never', 'not a chance', 'nope'];
        if (yesKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
          nextIntent = 'collecting_quote_name';
          nextBotMessage = "Great! What is your full name?";
        } else if (noKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
          nextBotMessage = "No worries! Let me know if you need anything else!";
          nextAction = null;
          nextIntent = 'waiting_for_first_message';
        } else {
          nextBotMessage = "Please respond with 'Yes' or 'No' to confirm.";
        }
      } else if (nextIntent === 'collecting_quote_name') {
        nextTempData.name = userMessageText;
        nextIntent = 'collecting_quote_phone';
        nextBotMessage = "What is the best phone number to reach you?";
      } else if (nextIntent === 'collecting_quote_phone') {
        nextTempData.phone = userMessageText;
        nextIntent = 'collecting_quote_email';
        nextBotMessage = "What is your email address?";
      } else if (nextIntent === 'collecting_quote_email') {
        nextTempData.email = userMessageText;
        nextIntent = 'collecting_quote_services';
        nextBotMessage = "What services are you interested in? (Pool Opening, Pool Closing, Pool Services)";
      } else if (nextIntent === 'collecting_quote_services') {
        nextTempData.serviceType = userMessageText;
        nextIntent = 'collecting_quote_message';
        nextBotMessage = "Please describe why you are requesting this quote or any specific questions you have.";
      } else if (nextIntent === 'collecting_quote_message') {
        nextTempData.message = userMessageText;
        nextIntent = 'confirm_quote_final';
        nextConfirmationStep = true;
        nextConfirmingType = 'quote';
        nextBotMessage = `Okay, I have a quote request from ${nextTempData.name}. Phone: ${nextTempData.phone}, Email: ${nextTempData.email}. Service Type: ${nextTempData.serviceType}. Reason: ${nextTempData.message}. Does this look correct? (Yes/No)`;
      }
    } else if (nextAction === 'contact') {
      if (nextIntent === 'confirm_contact_start') {
        const yesKeywords = ['yes', 'y', 'yeah', 'sure', 'i guess so'];
        const noKeywords = ['no', 'n', 'nah', 'im good', 'never', 'not a chance', 'nope'];
        if (yesKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
          nextIntent = 'collecting_contact_name';
          nextBotMessage = "Great! What is your full name?";
        } else if (noKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
          nextBotMessage = "No worries! Let me know if you need anything else!";
          nextAction = null;
          nextIntent = 'waiting_for_first_message';
        } else {
          nextBotMessage = "Please respond with 'Yes' or 'No' to confirm.";
        }
      } else if (nextIntent === 'collecting_contact_name') {
        nextTempData.name = userMessageText;
        nextIntent = 'collecting_contact_phone';
        nextBotMessage = "What is the best phone number to reach you?";
      } else if (nextIntent === 'collecting_contact_phone') {
        nextTempData.phone = userMessageText;
        nextIntent = 'collecting_contact_email';
        nextBotMessage = "What is your email address?";
      } else if (nextIntent === 'collecting_contact_email') {
        nextTempData.email = userMessageText;
        nextIntent = 'collecting_contact_message';
        nextBotMessage = "Please describe why you are requesting to be contacted.";
      } else if (nextIntent === 'collecting_contact_message') {
        nextTempData.message = userMessageText;
        nextIntent = 'confirm_contact_final';
        nextConfirmationStep = true;
        nextConfirmingType = 'contact';
        nextBotMessage = `Okay, I have a contact request from ${nextTempData.name}. Phone: ${nextTempData.phone}, Email: ${nextTempData.email}. Reason: ${nextTempData.message}. Does this look correct? (Yes/No)`;
      }
    }

    if (nextIntent === 'completed') {
      nextIntent = 'waiting_for_first_message';
      nextTempData = {};
      nextAction = null;
      nextConfirmationStep = false;
      nextConfirmingType = null;
    }

    setConversationState({
      intent: nextIntent,
      tempData: nextTempData,
      lastBotMessage: nextBotMessage,
      currentAction: nextAction,
      confirmationStep: nextConfirmationStep,
      confirmingType: nextConfirmingType,
    });
    addBotMessage(nextBotMessage);
    setIsTyping(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessageText = input.trim();
    addUserMessage(userMessageText);
    setInput('');

    await processChatbotResponse(userMessageText);
  };

  return (
    <div className={`chatbot-container ${isChatbotOpen ? 'chatbot-open' : 'chatbot-closed'} ${showChatbot ? '' : 'hidden'}`}>
      {/* The chatbot-maximize-button will now only show if showChatbot is true AND isChatbotOpen is false */}
      {!isChatbotOpen && showChatbot && (
        <button className="chatbot-maximize-button" onClick={() => setIsChatbotOpen(true)} aria-label="Open Chatbot">
          <MessageSquare size={24} />
        </button>
      )}

      {isChatbotOpen && (
        <>
          <div className="chat-header">
            <h2 className="chat-title">Better State Chatbot</h2>
            <button className="chat-minimize-button" onClick={() => setIsChatbotOpen(false)} aria-label="Minimize Chatbot">
              <Minus size={20} />
            </button>
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
                >
                  {msg.text}
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
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="input-form">
            <div className="input-group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="input-field"
                disabled={isTyping}
                ref={inputRef}
              />
              <button
                type="submit"
                className="send-button"
                disabled={isTyping}
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