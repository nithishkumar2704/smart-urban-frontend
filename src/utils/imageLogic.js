// Smart Image Logic for Services
export const getServiceImage = (item) => {
    // 1. If item has a valid image URL uploaded by vendor, use it
    if (item && item.image && item.image.startsWith('http')) {
        return item.image;
    }

    // Prepare text for matching
    const category = (item?.category || '').toLowerCase().trim();
    const title = (item?.title || '').toLowerCase().trim();
    const text = category + ' ' + title;

    // 2. Strict Category Matching (Prioritized)
    const categoryMap = {
        'cleaning': 'https://images.unsplash.com/photo-1612857017655-7b035a3d8a5f?w=800&q=80', // Man cleaning gate
        'house cleaning': 'https://images.unsplash.com/photo-1612857017655-7b035a3d8a5f?w=800&q=80',
        'plumbing': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80',
        'electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
        'ac repair': 'https://plus.unsplash.com/premium_photo-1683134512538-7b390d0adc9e?q=80&w=800&auto=format&fit=crop', // Man cleaning AC
        'pest control': 'https://images.unsplash.com/photo-1584650543209-482833075c32?w=800&q=80',
        'carpentry': 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=800&q=80',
        'gardening': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
        'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', // Grocery/Vegetables
        'daily supplies': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'
    };

    if (categoryMap[category]) {
        return categoryMap[category];
    }

    // 3. Keyword Matching (Fallback)
    if (text.includes('grocery') || text.includes('vegetable') || text.includes('fruit') || text.includes('daily') || text.includes('dairy'))
        return categoryMap['grocery'];

    if (text.includes('clean') || text.includes('maid') || text.includes('mop') || text.includes('house'))
        return categoryMap['cleaning'];

    if (text.includes('plumb') || text.includes('pipe') || text.includes('leak') || text.includes('sink'))
        return categoryMap['plumbing'];

    if (text.includes('electr') || text.includes('wir') || text.includes('power') || text.includes('shock'))
        return categoryMap['electrical'];

    if (text.includes('paint') || text.includes('wall') || text.includes('decor'))
        return categoryMap['painting'];

    if (text.includes('ac') || text.includes('cool') || text.includes('conditioner'))
        return categoryMap['ac repair'];

    if (text.includes('beauty') || text.includes('hair') || text.includes('facial') || text.includes('makeup'))
        return categoryMap['beauty'];

    if (text.includes('pest') || text.includes('bug') || text.includes('insect'))
        return categoryMap['pest control'];

    if (text.includes('wood') || text.includes('furniture') || text.includes('carpenter'))
        return categoryMap['carpentry'];

    if (text.includes('grocery') || text.includes('vegetable') || text.includes('fruit') || text.includes('daily'))
        return categoryMap['grocery'];

    // 4. Deterministic Generic Fallback
    const sum = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const genericFallbacks = [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80', // Generic Worker
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', // Planning/Office
        'https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?w=800&q=80'  // Tools
    ];

    return genericFallbacks[sum % genericFallbacks.length];
};
