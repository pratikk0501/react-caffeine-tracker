import { useState } from "react";
import { coffeeOptions } from "../utils";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

function CoffeeForm(props) {
  const { isAuthenticated } = props;
  const [showModal, setShowModal] = useState(false);
  const [coffeeSelection, setCoffeeSelection] = useState(null);
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
  const [cost, setCost] = useState(0);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const { globalData, setGlobalData, globalUser } = useAuth();

  async function handleSubmission() {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }
    // guard clause to prevent submission if form incomplete
    if (!coffeeSelection) {
      return;
    }

    try {
      // create new data object
      const newGlobalData = { ...(globalData || {}) };

      const nowTime = Date.now();
      const timeStamp = nowTime - (hour * 60 * 60 * 1000 + min * 60 * 1000);
      const newData = {
        name: coffeeSelection,
        cost: cost,
      };
      newGlobalData[timeStamp] = newData;

      // update the global state
      setGlobalData(newGlobalData);

      // add data to the firestore database
      const userRef = doc(db, "users", globalUser.uid);
      const res = await setDoc(
        userRef,
        {
          [timeStamp]: newData,
        },
        { merge: true }
      );
      setCoffeeSelection(null);
      setHour(0);
      setMin(0);
      setCost(0);
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      <div className="section-header">
        <i className="fa-solid fa-pencil"></i>
        <h2>Start Tracking Today</h2>
      </div>
      <h4>Select coffee type</h4>
      <div className="coffee-grid">
        {coffeeOptions.slice(0, 5).map((option, optionidx) => {
          return (
            <button
              className={
                "button-card " +
                (option.name === coffeeSelection
                  ? "coffee-button-selected"
                  : "")
              }
              key={optionidx}
              onClick={() => {
                setCoffeeSelection(option.name);
                setShowCoffeeTypes(false);
              }}
            >
              <h4>{option.name}</h4>
              <p>{option.caffeine} mg</p>
            </button>
          );
        })}
        <button
          className={
            "button-card " + (showCoffeeTypes ? "coffee-button-selected" : "")
          }
          onClick={() => {
            setShowCoffeeTypes(!showCoffeeTypes);
            setCoffeeSelection(null);
          }}
        >
          <h4>Other</h4>
          <p>n/a</p>
        </button>
      </div>
      {showCoffeeTypes && (
        <select
          onChange={(event) => {
            setCoffeeSelection(event.target.value);
          }}
          name="coffee-list"
          id="coffee-list"
        >
          <option value="null">Select type</option>
          {coffeeOptions.map((option, optionidx) => {
            return (
              <option value={option.name} key={optionidx}>
                {option.name}({option.caffeine} mg)
              </option>
            );
          })}
        </select>
      )}
      <h4>Add the cost (₹)</h4>
      <input
        className="w-full"
        type="number"
        value={cost}
        onChange={(e) => {
          setCost(e.target.value);
        }}
        placeholder="₹ Enter cost"
      />
      <h4>Time since consumption</h4>
      <div className="time-entry">
        <div>
          <h6>Hours</h6>
          <select
            onChange={(e) => {
              setHour(e.target.value);
            }}
            id="hours-select"
          >
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour, houridx) => {
              return (
                <option value={hour} key={houridx}>
                  {hour}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <h6>Mins</h6>
          <select
            onChange={(e) => {
              setMin(e.target.value);
            }}
            id="mins-select"
          >
            {[0, 5, 10, 15, 30, 45].map((min, minidx) => {
              return (
                <option value={min} key={minidx}>
                  {min}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <button onClick={handleSubmission}>
        <p>Add Entry</p>
      </button>
    </>
  );
}

export default CoffeeForm;
