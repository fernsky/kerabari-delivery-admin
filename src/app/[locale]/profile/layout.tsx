import { validateRequest } from "@/lib/auth/validate-request";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ClientSideNavigation } from "@/components/layout/ClientSideNavigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarNav from "@/components/layout/SidebarNav";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get authenticated user
  const { user } = await validateRequest();

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFCFD] pb-[100px]">
      <SiteHeader />

      <div className="flex-1">
        <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] md:gap-6 lg:gap-8 mt-4 md:mt-6">
            {/* Desktop sidebar - reduced width */}
            <div className="hidden md:block sticky top-16 self-start h-[calc(100vh-4rem)] w-full">
              <ScrollArea className="h-full w-full">
                <div className="pt-4 pr-4 w-full max-w-[240px] lg:max-w-[260px]">
                  <SidebarNav />
                </div>
              </ScrollArea>
            </div>

            {/* Main content area - now gets more space */}
            <div className="w-full min-w-0 pb-[100px]">{children}</div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <ClientSideNavigation />
    </div>
  );
}
