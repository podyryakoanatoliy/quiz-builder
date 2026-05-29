"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Сталася помилка при завантаженні квізів!</h2>
      <button onClick={() => reset()}>Спробувати знову</button>
    </div>
  );
}
