export const demoKitchen = {
  name: "Sabal Demo Kitchen",
  neighborhood: "Coconut Grove",
  city: "Miami, FL",
  url: "demokitchen.sabalsites.com/menu",
  hours: "Open · 11:00 AM – 9:00 PM",
  categories: ["Wood-fired", "Garden", "Sweets"] as const,
};

export const demoDishes = [
  {
    slug: "citrus-herb-chicken",
    name: "Citrus herb chicken",
    price: "22",
    description: "Half chicken, preserved lemon, garlic oil, and herbs.",
    category: "Wood-fired",
    photo: "/demo/chicken.jpg",
    alt: "Roasted citrus herb chicken on a dark plate, Sabal Demo Kitchen menu photo",
  },
  {
    slug: "charred-cauliflower",
    name: "Charred cauliflower",
    price: "16",
    description: "Tahini, chili, mint, and toasted seeds.",
    category: "Wood-fired",
    photo: "/demo/cauliflower.jpg",
    alt: "Charred cauliflower with tahini and herbs, Sabal Demo Kitchen menu photo",
  },
  {
    slug: "grove-greens",
    name: "Grove greens",
    price: "14",
    description: "Citrus vinaigrette, pistachio, shaved fennel.",
    category: "Garden",
    photo: "/demo/greens.jpg",
    alt: "Green salad with citrus and pistachio, Sabal Demo Kitchen menu photo",
  },
  {
    slug: "tomato-bread",
    name: "Tomato bread",
    price: "9",
    description: "Grilled sourdough, ripe tomato, olive oil.",
    category: "Garden",
    photo: "/demo/bread.jpg",
    alt: "Grilled tomato bread on a wooden board, Sabal Demo Kitchen menu photo",
  },
] as const;
