// Chatbot-data-context.jsx
import { createContext, useContext } from 'react';

const chatbotKnowledgeBase = {
    // Initial greeting and main menu options
    "initialGreeting": "Hi! I'm your virtual assistant. How can I help you today?",
    "mainMenuOptions": [
        "Contact Request",
        "Services",
        "About Us",
        "Hours",
        "FAQ", // Moved FAQ here
        "Social Media & Contact Information" // Now at the bottom
    ],
    // Service options for selection
    "serviceOptions": [
        "Pool Opening",
        "Pool Closing",
        "Pool Servicing"
    ],

    // Detailed responses/descriptions for services
    "serviceDescriptions": {
        "Pool Opening": {
            description: "Our comprehensive **Pool Opening** service includes removing and storing your winter cover, reassembling all filtration and heating equipment, starting up the circulation system, and an initial shock treatment and chemical balancing. We ensure your pool is sparkling clean and ready for the swimming season!",
            averageTime: "Average time: 2-3 hours for first visit. Requires one visit."
        },
        "Pool Closing": {
            description: "Our meticulous **Pool Closing** service prepares your pool for the off-season. This includes draining water to the appropriate level, winterizing plumbing lines, adding winterizing chemicals, and securely installing your winter cover. Protect your investment through the colder months!",
            averageTime: "Average time: 2-4 hours for first visit. Requires one visit."
        },
        "Pool Servicing": {
            description: "Our regular **Pool Servicing** includes weekly or bi-weekly visits for skimming, vacuuming, brushing walls, backwashing filter, testing and balancing water chemistry, and inspecting equipment. Keep your pool pristine all season long!",
            averageTime: "Average time: 1-1.5 hours per visit. Recurring visits (weekly/bi-weekly)."
        }
    },

    // General Responses
    "responses": {
        "aboutUs": "Better State LLC is owned and operated by Keyn Broodshood. We are dedicated to providing top-notch pool services to ensure your pool is always in its enchanting state.",
        "hours": "Our business hours are Monday to Friday, 9 AM to 5 PM. We are closed on weekends and major holidays.",
        "socialMediaContact": "You can find us on [Facebook Link] and [Instagram Link]! For direct inquiries, email us at info@betterstate.com or call (555) 123-4567.", // Placeholder links
        "faqs": {
            "initial": "I can answer common questions about job lengths, chemical safety, equipment maintenance, and seasonal tips. What specific FAQ are you interested in?",
            "jobLengths": "The length of a job depends on the service. A standard cleaning usually takes 1-2 hours, while repairs or major services might take longer. We can give you a more accurate estimate when you request a quote or appointment.",
            "chemicalSafety": "Yes, we prioritize safety! We use industry-standard chemicals and apply them according to strict guidelines to ensure they are safe for your pool and its users. We always advise waiting the recommended time after treatment before swimming.",
            "chemicalSafetyPets": "Yes, when applied correctly and given the proper time to dissipate, the chemicals we use are generally safe for pets. We recommend keeping pets away from the pool area during and immediately after treatment, and always ensure they don't drink pool water.",
            "equipmentMaintenance": "Regularly clean your skimmer baskets and pump strainer to ensure good water circulation. Backwash your filter as needed to maintain efficiency.",
            "seasonalTips": "For winter, ensure your pool is properly closed to prevent damage from freezing. For summer, increase filter run time and check chemicals more frequently due to increased usage.",
            "veteranDiscount": "Yes, we offer a veteran discount! Please mention your veteran status when you speak with our team to apply it to your service."
        },
    },
    // Default response when input is not understood or no button is available
    "defaultResponse": "I'm sorry, I didn't understand that. Please use the buttons provided or type 'menu' to return to the main options.",
    "farewell": "Goodbye! Have a great day!",
    "contactSummaryIntro": "Here is a summary of your contact request:",
    "confirmationPrompt": "Does this look correct? (Yes/No)",
    "serviceLearnMorePrompt": "Which service would you like to learn more about?",
    "faqMenuOptions": [
        "Job Lengths",
        "Chemical Safety",
        "Equipment Maintenance",
        "Seasonal Tips",
        "Veteran Discount"
    ]
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