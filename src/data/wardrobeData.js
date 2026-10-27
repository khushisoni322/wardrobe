import {
    LayoutGrid,
    Shirt,
    ShoppingBag,
    Sparkles,
  } from 'lucide-react';
  
  // ============================================
  // CLOTHING CATEGORIES
  // ============================================
  
  export const categories = [
    'All Clothes',
    'Tops',
    'Shirts',
    'Jeans',
    'Pants',
    'Kurtis',
    'Suits',
    'Sarees',
    'Dresses',
    'Other',
  ];
  
  // ============================================
  // CATEGORY ICONS
  // ============================================
  
  export const categoryIcons = {
    'All Clothes': LayoutGrid,
    Tops: Shirt,
    Shirts: Shirt,
    Jeans: ShoppingBag,
    Pants: ShoppingBag,
    Kurtis: Shirt,
    Suits: Sparkles,
    Sarees: Sparkles,
    Dresses: Shirt,
    Other: ShoppingBag,
  };
  
  // ============================================
  // FAMILY MEMBERS
  // ============================================
  
  export const familyMembers = [
    {
      id: 'all',
      name: 'Everyone',
      emoji: '👨‍👩‍👧‍👦',
      color: 'bg-amber-100',
    },
    {
      id: 'me',
      name: 'My Wardrobe',
      emoji: '👩🏻',
      color: 'bg-rose-100',
    },
    {
      id: 'mom',
      name: 'Mom',
      emoji: '👩🏻‍🦳',
      color: 'bg-orange-100',
    },
    {
      id: 'sister',
      name: 'Sister',
      emoji: '👧🏻',
      color: 'bg-purple-100',
    },
    {
      id: 'brother',
      name: 'Brother',
      emoji: '👦🏻',
      color: 'bg-blue-100',
    },
    {
      id: 'dad',
      name: 'Dad',
      emoji: '👨🏻',
      color: 'bg-green-100',
    },
  ];
  
  // ============================================
  // INITIAL CLOTHING DATA
  // ============================================
  
  export const initialClothes = [
    {
      id: 1,
      name: 'Everyday White Shirt',
      category: 'Shirts',
      color: 'White',
      occasion: 'Casual',
      owner: 'me',
      favorite: true,
      image:
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 2,
      name: 'Classic Blue Jeans',
      category: 'Jeans',
      color: 'Blue',
      occasion: 'Casual',
      owner: 'me',
      favorite: false,
      image:
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 3,
      name: 'Floral Summer Dress',
      category: 'Dresses',
      color: 'Pink',
      occasion: 'Outing',
      owner: 'me',
      favorite: true,
      image:
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 4,
      name: 'Everyday Beige Top',
      category: 'Tops',
      color: 'Beige',
      occasion: 'Casual',
      owner: 'me',
      favorite: false,
      image:
        'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 5,
      name: 'Elegant Evening Outfit',
      category: 'Suits',
      color: 'Black',
      occasion: 'Party',
      owner: 'mom',
      favorite: false,
      image:
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 6,
      name: 'Weekend Denim',
      category: 'Jeans',
      color: 'Blue',
      occasion: 'Casual',
      owner: 'brother',
      favorite: false,
      image:
        'https://images.unsplash.com/photo-1511196044526-5cb3bcb7071b?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 7,
      name: 'Soft Pink Outfit',
      category: 'Tops',
      color: 'Pink',
      occasion: 'Casual',
      owner: 'sister',
      favorite: true,
      image:
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 8,
      name: 'Classic Daily Shirt',
      category: 'Shirts',
      color: 'Cream',
      occasion: 'Work',
      owner: 'me',
      favorite: false,
      image:
        'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: 9,
      name: "Dad's Casual Shirt",
      category: 'Shirts',
      color: 'Blue',
      occasion: 'Casual',
      owner: 'dad',
      favorite: false,
      image:
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=85',
    },
  ];
  
  // ============================================
  // EMPTY CLOTHING FORM
  // ============================================
  
  export const emptyForm = {
    name: '',
    category: 'Tops',
    color: '',
    occasion: 'Casual',
    owner: 'me',
  };