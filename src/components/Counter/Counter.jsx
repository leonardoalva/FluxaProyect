import { useState } from "react";
import "./Counter.css";

function Counter({ onConfirm, btnText, stock }) {
  const [counter, setCounter] = useState(0);

  const maxAllowed = (() => {
    const n = Number(stock);
    return Number.isNaN(n) ? Infinity : Math.max(0, Math.floor(n));
  })();

  const confirm = () => {
    if (counter > 0 && counter <= maxAllowed) {
      onConfirm(counter);
    }
  };

  const isAtMax = counter >= maxAllowed;
  const noStock = maxAllowed === 0;

  const increment = () => {
    setCounter((prev) => (prev < maxAllowed ? prev + 1 : prev));
  };

  const decrement = () => {
    if (counter > 0) {
      setCounter((prev) => prev - 1);
    }
  }

  return (
    <div className="Counter_Container">
      <button
        className="btn_counter"
        disabled={counter === 0}
        onClick={decrement}
      >
        -
      </button>

      <div className="counter-display">
        <p style={{margin:0}}>{counter}</p>
      </div>

      <button
        className="btn_counter"
        onClick={increment}
        disabled={isAtMax || noStock}
      >
        +
      </button>

      <button className="btn_counter" onClick={confirm} disabled ={counter === 0 || noStock}>
        {btnText}
      </button>

      {/* <button className='btn_counter' onClick={()=>setCounter(0)}>Resetear</button> */}
    </div>
  );
}

export default Counter
