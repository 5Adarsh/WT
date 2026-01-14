import { useState } from "react";
import "./App.css";

function App() {
  const [food, setFood] = useState("");
  const [meals, setMeals] = useState([]);

  const getMeals = async () => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${food}`
      );
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (<>
    <div className="container">
      <h2>Meal Finder App</h2>
      <input
        placeholder="Enter ingredient (e.g., banana)"
        value={food}
        onChange={(e) => setFood(e.target.value)}
        className="input-box"
      />

      <button onClick={getMeals}>Search Meals</button>
    </div>
    <div className="card-grid">
      {meals.map((meal) => (
        <div className="card" key={meal.idMeal}>
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            width="150"
          />
          <h4>{meal.strMeal}</h4>
          <p>ID: {meal.idMeal}</p>
        </div>
      ))}
    </div>
  </>
  );
}

export default App;
