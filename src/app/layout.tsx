import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {/* The Authentication Header */}
          <header className="flex justify-end p-4 border-b border-gray-200">
            <Show when="signed-out">
              <div className="flex gap-4">
                <SignInButton mode="modal" />
                <SignUpButton mode="modal" />
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          the login modal doesn't look good, no dark mode support, button color doesn't match professional app i am making. it looks like a app that will extort money from me
          
          {/* Your actual app content (like your TaskCard) will render here */}
          <main className="p-8">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}