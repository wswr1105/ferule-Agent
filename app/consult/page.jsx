import { Suspense } from "react";
import ConsultForm from "./ConsultForm";

export default function ConsultPage() {
  return (
    <Suspense>
      <ConsultForm />
    </Suspense>
  );
}
