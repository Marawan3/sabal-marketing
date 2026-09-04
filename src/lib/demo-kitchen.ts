export const demoKitchen = {
  name: "Sabal Demo Kitchen",
  neighborhood: "Coconut Grove",
  city: "Miami, FL",
  url: "yourrestaurant.com/menu",
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
    /* REPLACE: dish-chicken 800x800 real photo */
    alt: "Placeholder for citrus herb chicken. Replace with a real dish photo.",
  },
  {
    slug: "charred-cauliflower",
    name: "Charred cauliflower",
    price: "16",
    description: "Tahini, chili, mint, and toasted seeds.",
    category: "Wood-fired",
    /* REPLACE: dish-cauliflower 800x800 real photo */
    alt: "Placeholder for charred cauliflower. Replace with a real dish photo.",
  },
  {
    slug: "grove-greens",
    name: "Grove greens",
    price: "14",
    description: "Citrus vinaigrette, pistachio, shaved fennel.",
    category: "Garden",
    /* REPLACE: dish-greens 800x800 real photo */
    alt: "Placeholder for grove greens. Replace with a real dish photo.",
  },
  {
    slug: "tomato-bread",
    name: "Tomato bread",
    price: "9",
    description: "Grilled sourdough, ripe tomato, olive oil.",
    category: "Garden",
    /* REPLACE: dish-bread 800x800 real photo */
    alt: "Placeholder for tomato bread. Replace with a real dish photo.",
  },
] as const;
