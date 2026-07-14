import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body className="bg-gray-950 text-gray-100 min-h-screen font-sans">
          
          <header className="flex justify-between md:justify-end items-center p-4 md:p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
            <div className="md:hidden font-bold text-indigo-400 tracking-tight">Academic AI</div>
            
            <Show when="signed-out">
              <div className="flex gap-3 md:gap-4">
                <SignInButton>
                  <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition-colors">
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>

          <main className="p-4 md:p-8">
            {children}
          </main>

        </body>
      </html>
    </ClerkProvider>
  );
}