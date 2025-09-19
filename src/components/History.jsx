import { useAuth } from "../context/AuthContext";
import {
  calculateCurrentCaffeineLevel,
  getCaffeineAmount,
  timeSinceConsumption,
} from "../utils";

function History() {
  const { globalData } = useAuth();
  return (
    <>
      <div className="section-header">
        <i className="fa-solid fa-history" />
        <h2>History</h2>
      </div>
      <p>
        <i>Hover for more information!</i>
      </p>
      <div className="coffee-history">
        {Object.keys(globalData)
          .sort((a, b) => b - a)
          .map((utcTime, coffeeidx) => {
            const coffee = globalData[utcTime];
            const remainingAmount = calculateCurrentCaffeineLevel({
              [utcTime]: coffee,
            });

            const summary = `${coffee.name} | ₹${
              coffee.cost
            } | ${timeSinceConsumption(
              utcTime
            )} | ${remainingAmount} mg / ${getCaffeineAmount(coffee.name)} mg`;

            return (
              <div title={summary} key={coffeeidx}>
                <i className="fa-solid fa-mug-hot" />
              </div>
            );
          })}
      </div>
    </>
  );
}

export default History;
