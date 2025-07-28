import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/util/fileTrie"

// Sort by date (newest first), then alphabetically for items without dates.
let explorerSortFn = (a: FileTrieNode, b: FileTrieNode) => {
  // Get dates for both nodes
  const dateA = a.data?.date
  const dateB = b.data?.date

  if (dateA && dateB) {
    // Both have dates, sort by date (newest first)
    const parsedDateA = typeof dateA === 'string' ? new Date(dateA) : dateA
    const parsedDateB = typeof dateB === 'string' ? new Date(dateB) : dateB
    return parsedDateB.getTime() - parsedDateA.getTime()
  }

  if (dateA && !dateB) {
    return -1  // Items with dates come first
  }

  if (!dateA && dateB) {
    return 1   // Items with dates come first
  }

  // Neither has a date, sort alphabetically
  return a.displayName.localeCompare(b.displayName, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "remigerme/my-quartz",
        repoId: "R_kgDOO82VrQ",
        category: "Announcements",
        categoryId: "DIC_kwDOO82Vrc4Crqxa",
        lang: "en",
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    Component.MobileOnly(Component.TableOfContents()),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "Posts",
      sortFn: explorerSortFn,
    }),
  ],
  right: [
    // Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    // Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({ title: "Posts", sortFn: explorerSortFn }),
  ],
  right: [],
}
