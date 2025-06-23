import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  items: Array<{
    title: string;
    href: string;
  }>;
  badge?: string;
  disabled?: boolean;
}

interface SidebarNavState {
  // Section states
  openSections: Record<string, boolean>;

  // Actions
  toggleSection: (sectionTitle: string) => void;
  setOpenSections: (sections: Record<string, boolean>) => void;

  // Utility actions
  autoExpandForPath: (path: string, items: NavItem[]) => void;
  isPathActive: (href: string, currentPath: string) => boolean;
  isSectionActive: (section: NavItem, currentPath: string) => boolean;
}

const initialState = {
  openSections: {},
};

export const useSidebarNavStore = create<SidebarNavState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Section management
        toggleSection: (sectionTitle: string) =>
          set((state) => ({
            openSections: {
              ...state.openSections,
              [sectionTitle]: !state.openSections[sectionTitle],
            },
          })),

        setOpenSections: (sections: Record<string, boolean>) =>
          set({ openSections: sections }),

        // Auto-expand logic
        autoExpandForPath: (path: string, items: NavItem[]) => {
          // Initialize all sections to be open by default
          const sectionsToOpen: Record<string, boolean> = {};
          items.forEach((section) => {
            sectionsToOpen[section.title] = true;
          });

          set((state) => ({
            openSections: {
              ...sectionsToOpen,
              ...state.openSections,
            },
          }));

          // Original path-specific logic can remain as a fallback
          const normalizedPath = path.replace(/^\/(en|ne)/, "");

          items.forEach((section) => {
            const normalizedSectionHref = section.href.replace(
              /^\/(en|ne)/,
              "",
            );
            const isCurrentSection =
              normalizedPath === normalizedSectionHref ||
              normalizedPath.startsWith(normalizedSectionHref + "/");
            const hasActiveChild = section.items.some((item) => {
              const normalizedItemHref = item.href.replace(/^\/(en|ne)/, "");
              return normalizedPath === normalizedItemHref;
            });

            if (isCurrentSection || hasActiveChild) {
              sectionsToOpen[section.title] = true;
            }
          });
        },

        // Utility functions
        isPathActive: (href: string, currentPath: string) => {
          const normalizedPath = currentPath.replace(/^\/(en|ne)/, "");
          const normalizedHref = href.replace(/^\/(en|ne)/, "");
          return normalizedPath === normalizedHref;
        },

        isSectionActive: (section: NavItem, currentPath: string) => {
          const normalizedPath = currentPath.replace(/^\/(en|ne)/, "");
          const normalizedHref = section.href.replace(/^\/(en|ne)/, "");

          const value =
            normalizedPath === normalizedHref ||
            normalizedPath.startsWith(normalizedHref + "/") ||
            section.items.some((item) => {
              const normalizedItemHref = item.href.replace(/^\/(en|ne)/, "");
              return normalizedPath === normalizedItemHref;
            });

          return value;
        },
      }),
      {
        name: "sidebar-nav-storage",
        partialize: (state) => ({
          openSections: state.openSections,
        }),
      },
    ),
    {
      name: "sidebar-nav-store",
    },
  ),
);
