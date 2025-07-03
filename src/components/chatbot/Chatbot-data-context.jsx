import { createContext, useContext } from 'react';

const chatbotKnowledgeBase = {
  "initialGreeting": "Hi, I'm a small-scale chatbot created to assist you. I can help with setting up appointments, contact requests, quote requests, and answer questions about our services, company hours, job lengths, or even some pool cleaning facts! Just say something to get started.",
  "services": "We offer a variety of pool services including regular cleaning, chemical balancing, equipment repair, and seasonal opening/closing. What are you interested in?",
  "hours": "Our business hours are Monday to Friday, 9 AM to 5 PM. We are closed on weekends and major holidays.",
  "job lengths": "The length of a job depends on the service. A standard cleaning usually takes 1-2 hours, while repairs or major services might take longer. We can give you a more accurate estimate when you request a quote or appointment.",
  "pool cleaning facts": "Did you know regular pool cleaning prevents algae growth and extends the life of your pool equipment? Also, maintaining proper chemical balance is crucial for water safety and clarity!",
  "default": "I'm not sure I understand. Can you ask about services, hours, job lengths, or if you'd like a quote, appointment, or contact request?",
  "safety tips": "Always keep pool chemicals out of reach of children and pets. Test your water regularly to ensure proper chemical balance for safety and sanitation.",
  "equipment maintenance": "Regularly clean your skimmer baskets and pump strainer to ensure good water circulation. Backwash your filter as needed to maintain efficiency.",
  "seasonal tips": "For winter, ensure your pool is properly closed to prevent damage from freezing. For summer, increase filter run time and check chemicals more frequently due to increased usage.",
  "owner_info": "Better State LLC is owned and operated by Keyn Broodshood.",
  "chemical_safety": "Yes, we prioritize safety! We use industry-standard chemicals and apply them according to strict guidelines to ensure they are safe for your pool and its users. We always advise waiting the recommended time after treatment before swimming.",
  "chemical_safety_pets": "Yes, when applied correctly and given the proper time to dissipate, the chemicals we use are generally safe for pets. We recommend keeping pets away from the pool area during and immediately after treatment, and always ensure they don't drink pool water.",
  "veteran_discount": "Yes, we offer a veteran discount! Please mention your veteran status when you speak with our team to apply it to your service.",
};

const ChatbotDataContext = createContext(null);

export const useChatbotData = () => {
  const context = useContext(ChatbotDataContext);
  if (context === undefined) {
    throw new Error('useChatbotData must be used within a ChatbotDataProvider');
  }
  return context;
};

export const ChatbotDataProvider = ({ children }) => {
  return (
    <ChatbotDataContext.Provider value={chatbotKnowledgeBase}>
      {children}
    </ChatbotDataContext.Provider>
  );
};
