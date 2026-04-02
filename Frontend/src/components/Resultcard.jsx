export default function Resultcard({ result }) {
  const isFresh = result.toLowerCase().includes("fresh");

  return (
    <div
      className={`mt-6 px-6 py-4 rounded-xl text-lg font-semibold ${
        isFresh ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {result}
    </div>
  );
}