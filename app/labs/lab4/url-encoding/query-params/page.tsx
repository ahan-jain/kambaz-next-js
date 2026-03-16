//"use client";
//import { useSearchParams } from "next/navigation";

export default function QueryCalculator({
  searchParams,
}: {
  searchParams: { a?: string; b?: string };
}) {
  const aRaw = searchParams.a ?? "0";
  const bRaw = searchParams.b ?? "0";

  const a = parseFloat(aRaw);
  const b = parseFloat(bRaw);
  const sum = a + b;

  return (
    <div style={{ padding: 40 }}>
      <h1>Calculator – Query Parameters</h1>
      Raw query values (already decoded by Next.js):
      <p>
        a = <code>{aRaw}</code>
      </p>
      <p>
        b = <code>{bRaw}</code>
      </p>
      <h2 style={{ color: "green" }}>Sum = {sum}</h2>
    </div>
  );
}
