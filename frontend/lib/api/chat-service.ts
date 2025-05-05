import type { Message } from "@/types/chat";
import { productService } from "./product-service";

// Simulated chat service since the endpoint isn't ready yet
class ChatService {
  private simulateNetworkDelay() {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1000 + Math.random() * 1000);
    });
  }

  async sendMessage(text: string, image?: File): Promise<Message> {
    await this.simulateNetworkDelay();

    // Create user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    // If there's an image, add it to the message
    if (image) {
      userMessage.image = URL.createObjectURL(image);
    }

    return userMessage;
  }

  async getAIResponse(text: string, image?: File): Promise<Message> {
    await this.simulateNetworkDelay();

    // Generate AI response based on the message content
    let responseText = "";

    if (image) {
      responseText =
        "I see the image you've uploaded! Based on what I'm seeing, here are some products that might interest you. You can browse through the recommendations on the right, or let me know if you'd like something more specific.";
    } else {
      const lowercaseText = text.toLowerCase();

      // Try to fetch some real products based on the query
      try {
        const searchTerm = this.extractSearchTerm(lowercaseText);
        const { data } = await productService.listProducts({
          search: searchTerm,
          size: 3,
        });

        if (data.data.length > 0) {
          const products = data.data;
          responseText = this.generateResponseWithProducts(
            lowercaseText,
            products,
          );
        } else {
          responseText = this.generateGenericResponse(lowercaseText);
        }
      } catch (error) {
        console.error("Error fetching products for chat:", error);
        responseText = this.generateGenericResponse(lowercaseText);
      }
    }

    // Create AI response
    const aiMessage: Message = {
      id: `ai_${Date.now()}`,
      sender: "ai",
      text: responseText,
      timestamp: new Date().toISOString(),
    };

    return aiMessage;
  }

  private extractSearchTerm(text: string): string {
    // Extract potential search terms from the message
    const commonPhrases = [
      "find me",
      "show me",
      "looking for",
      "search for",
      "i need",
      "i want",
      "can you find",
      "recommend",
    ];

    let searchTerm = text;

    for (const phrase of commonPhrases) {
      if (text.includes(phrase)) {
        const parts = text.split(phrase);
        if (parts.length > 1) {
          searchTerm = parts[1].trim();
          break;
        }
      }
    }

    // Remove common words and punctuation
    return searchTerm
      .replace(/[.,?!;:]/g, "")
      .replace(/\b(a|an|the|for|me|please|some|good|best)\b/gi, "")
      .trim();
  }

  private generateResponseWithProducts(text: string, products: any[]): string {
    const productNames = products.map((p) => p.title).join(", ");

    if (text.includes("laptop") || text.includes("computer")) {
      return `I've found some excellent laptop options for you! There's the ${productNames}. I've added these to your suggestions panel. Would you like more details on any of these?`;
    }

    if (text.includes("phone") || text.includes("smartphone")) {
      return `Looking for a new phone? I've curated some top options based on the latest reviews: ${productNames}. I've added these to your suggestions panel. Which aspects are most important to you?`;
    }

    if (
      text.includes("headphone") ||
      text.includes("earbuds") ||
      text.includes("audio")
    ) {
      return `For audio gear, I'd recommend checking out ${productNames}. I've added these to your suggestions panel. Would you prefer over-ear headphones or earbuds?`;
    }

    return `I've found some products that might match what you're looking for: ${productNames}. Take a look at the recommendations on the right, or give me more details about what you need so I can refine my suggestions.`;
  }

  private generateGenericResponse(text: string): string {
    if (text.includes("hello") || text.includes("hi")) {
      return `Hello! I'm Baiyit, your AI shopping assistant. I can help you find products, answer questions, and provide recommendations. What are you looking for today?`;
    }

    if (text.includes("recommend") || text.includes("suggest")) {
      return `Based on trending items, I'd recommend checking out our premium wireless headphones or the new ultra-slim laptops. I've added some suggestions to the panel on the right. Would you like me to refine these recommendations?`;
    }

    if (text.includes("compare")) {
      return `I'd be happy to help you compare products. Could you tell me which specific items you're interested in comparing? Or I can suggest some popular comparisons in a particular category.`;
    }

    return `I'd be happy to help with that. I've added some relevant products to the suggestions panel based on your query. Would you like more specific information about any of these items, or would you prefer different options?`;
  }
}

export const chatService = new ChatService();
