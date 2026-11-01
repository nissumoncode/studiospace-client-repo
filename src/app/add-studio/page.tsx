import AddStudioForm from "@/components/AddStudioForm/AddStudioForm";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function AddStudioPage() {
  return (
    <ProtectedRoute>
      <AddStudioForm />
    </ProtectedRoute>
  );
}
