"use server";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { validateRequest } from "@/lib/auth/validate-request";
import { Card, CardContent } from "@/components/ui/card";

const DashboardPage = async () => {
  const { user } = await validateRequest();
  if (!user) return null;

  return (
    <ContentLayout title="Dashboard">
      <div className="container mx-auto py-6">
        {/* Welcome Section with SVG */}
        <div className="flex flex-col md:flex-row items-center justify-between p-6 mb-8 bg-white rounded-lg shadow-sm border">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to the Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-4">
              Manage your data, view statistics, and access all administration
              features from this central dashboard.
            </p>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                View Households
              </button>
              <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90">
                View Businesses
              </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            {/* Dashboard SVG Graphic */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="180"
              height="180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
              <path d="M6 6h.01" />
              <path d="M12 6h.01" />
              <path d="M15 12h2" />
              <path d="M15 16h2" />
              <path d="M13 12h.01" />
              <path d="M13 16h.01" />
            </svg>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Total Households</h3>
                <div className="p-2 bg-blue-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold">2,834</div>
              <div className="text-sm text-gray-500 mt-2">Across all wards</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Total Businesses</h3>
                <div className="p-2 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500"
                  >
                    <path d="M3 3h18v18H3zM12 8v8m-4-4h8" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold">1,547</div>
              <div className="text-sm text-gray-500 mt-2">
                Registered businesses
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Total Individuals</h3>
                <div className="p-2 bg-purple-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-500"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold">12,458</div>
              <div className="text-sm text-gray-500 mt-2">
                Population recorded
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Pending Requests</h3>
                <div className="p-2 bg-amber-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold">24</div>
              <div className="text-sm text-gray-500 mt-2">
                Awaiting approval
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-blue-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">New Household Added</h3>
                  <p className="text-sm text-gray-500">
                    Ram Bahadur's household in Ward 8 was registered
                  </p>
                </div>
                <div className="text-gray-400 text-xs ml-auto">2 hours ago</div>
              </div>

              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Business Approved</h3>
                  <p className="text-sm text-gray-500">
                    Shyam Kirana Pasal was approved by admin
                  </p>
                </div>
                <div className="text-gray-400 text-xs ml-auto">5 hours ago</div>
              </div>

              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-red-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">User Logged Out</h3>
                  <p className="text-sm text-gray-500">
                    Admin user Hari signed out of the system
                  </p>
                </div>
                <div className="text-gray-400 text-xs ml-auto">Yesterday</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
};

export default DashboardPage;
