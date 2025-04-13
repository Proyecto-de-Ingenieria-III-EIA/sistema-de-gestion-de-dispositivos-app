import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Use false as the default state to avoid hydration mismatch
  const [isMobile, setIsMobile] = React.useState(false)
  
  React.useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return
    
    // Function to check if the viewport is mobile size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    checkMobile()
    
    // Set up event listener for screen size changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Different browsers may have different APIs
    if (mql.addEventListener) {
      mql.addEventListener("change", checkMobile)
      return () => mql.removeEventListener("change", checkMobile)
    } else {
      // Fallback for older browsers
      mql.addListener(checkMobile)
      return () => mql.removeListener(checkMobile)
    }
  }, [])
  
  return isMobile
}
