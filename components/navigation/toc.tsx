// "use client"

// import Link from "next/link"
// import clsx from "clsx"

// import { ScrollArea } from "@/components/ui/scroll-area"

// type TocProps = {
//   tocs: { href: string; level: number; text: string }[]
// }

// export default function Toc({ tocs }: TocProps) {
//   const handleSmoothScroll = (
//     e: React.MouseEvent<HTMLAnchorElement>,
//     href: string
//   ) => {
//     e.preventDefault()
//     const id = href.startsWith("#") ? href.slice(1) : href
//     const targetElement = document.getElementById(id)
//     if (targetElement) {
//       targetElement.scrollIntoView({ behavior: "smooth" })
//       window.history.pushState(null, "", href)
//     }
//   }

//   if (!tocs.length) {
//     return null
//   }

//   return (
//     <div className="flex flex-col gap-3 w-full pl-2">
//       <h3 className="text-sm font-semibold">On this page</h3>
//       <ScrollArea className="pt-0.5 pb-4">
//         <div className="flex flex-col gap-2.5 text-sm text-neutral-800 dark:text-neutral-300/85">
//           {tocs.map(({ href, level, text }) => (
//             <Link
//               key={href}
//               href={href}
//               scroll={false}
//               onClick={(e) => handleSmoothScroll(e, href)}
//               className={clsx({
//                 "pl-0": level == 2,
//                 "pl-3": level == 3,
//                 "pl-6": level == 4,
//               })}
//             >
//               {text}
//             </Link>
//           ))}
//         </div>
//       </ScrollArea>
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from "react" // Import useEffect and useState
import Link from "next/link"
import clsx from "clsx"

import { ScrollArea } from "@/components/ui/scroll-area"

type TocProps = {
  tocs: { href: string; level: number; text: string }[]
}

export default function Toc({ tocs }: TocProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const id = href.startsWith("#") ? href.slice(1) : href
    const targetElement = document.getElementById(id)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
      window.history.pushState(null, "", href)
      setActiveSection(id)
    }
  }

  useEffect(() => {
    // Get all heading elements from TOC
    const headingElements = tocs
      .map(({ href }) => {
        const id = href.startsWith("#") ? href.slice(1) : href
        return document.getElementById(id)
      })
      .filter((element): element is HTMLElement => element !== null)

    // Intersection Observer callback
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-30% 0px -70% 0px", // Middle 30% trigger zone
        // rootMargin: "-90% 0px 0px 0px", // Top 30% trigger zone
        threshold: 0, // Trigger on any visibility
      }
    )

    // Observe all headings
    headingElements.forEach((element) => observer.observe(element))

    // Cleanup
    return () => observer.disconnect()
  }, [tocs])

  // Handle initial hash URL
  useEffect(() => {
    const initialHash = window.location.hash.slice(1)
    if (initialHash) {
      setActiveSection(initialHash)
    }
  }, [])

  if (!tocs.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 w-full pl-2">
      <h3 className="text-sm font-semibold">On this page</h3>
      <ScrollArea className="pt-0.5 pb-4">
        <div className="flex flex-col gap-2.5 text-sm text-neutral-800 dark:text-neutral-300/85">
          {tocs.map(({ href, level, text }) => {
            const sectionId = href.startsWith("#") ? href.slice(1) : href
            return (
              <Link
                key={href}
                href={href}
                scroll={false}
                onClick={(e) => handleSmoothScroll(e, href)}
                className={clsx(
                  "hover:text-neutral-900 dark:hover:text-white transition-colors",
                  {
                    "pl-0": level === 2,
                    "pl-3": level === 3,
                    "pl-6": level === 4,
                    "font-bold text-neutral-900 dark:text-white":
                      activeSection === sectionId,
                  }
                )}
              >
                {text}
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
