import React, { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button type="button" onClick={() => setCount((count) => count + 1)}>
        Counter {count}
      </button>

      <style jsx>{`
      button {
        background: teal;
        color: white;
        border-radius: 1.5rem;
        cursor: pointer;
      }
    `}</style>
    </>
  );
}
