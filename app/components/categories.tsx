import * as React from 'react';

const categories = ['geography', 'film_and_tv', 'science', 'society_and_culture', 'history', 'arts_and_literature', 'general_knowledge', 'sport_and_leisure', 'food_and_drink', 'music']

export default function Categories() {
  return (
    <div className="categories">
      {categories.map(category => {
        return <p key={category}>{category}</p>
      })}
    </div>
  );
}
