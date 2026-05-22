import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-950">
      <SignUp />
    </div>
  );
}