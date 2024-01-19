import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { increment, decrement, reset, incrementByAmount } from "./counterSlice";
import { useAppDispatch } from "../../app/store";
import { useState } from "react";

const Counter = () => {
   const dispatch = useAppDispatch();
   const { count } = useSelector((state: RootState) => state.counter);
   const [value, setValue] = useState(0);

   return (
      <section>
         <p>{count}</p>
         <div>
            <button onClick={() => dispatch(increment())}>+1</button>
            <button onClick={() => dispatch(decrement())}>-1</button>
            <button onClick={() => dispatch(reset())}>0</button>
            <button onClick={() => dispatch(incrementByAmount(value))}>+{value}</button> 
         </div>
         <input type="number" onChange={(e) => setValue(Number(e.target.value))} />
      </section>
   );
};

export default Counter;
