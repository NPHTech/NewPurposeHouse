# Performance Audit & SSR Implementation Plan
## New Purpose House Website

**Date:** December 2024  
**Framework:** Next.js 16.0.0  
**Current Architecture:** Primarily Client-Side Rendered

---

## Executive Summary

This document outlines a comprehensive performance optimization strategy for the New Purpose House website. The current implementation is heavily client-side rendered, which impacts initial load time, SEO, and user experience. This plan provides actionable steps to implement Server-Side Rendering (SSR), optimize animations, and improve overall site performance.

---

## 1. Current State Analysis

### 1.1 Client-Side Components Identified

**Fully Client-Side Pages:**
- `app/page.tsx` - Home page (entire page is "use client")
- `components/header.tsx` - Navigation header
- `components/hero.tsx` - Hero section
- `components/applyBanner.tsx` - Apply banner
- `components/ui/timeline.tsx` - Timeline section

**Server Components (Good):**
- `components/footer.tsx` - Footer (no "use client")
- `app/apply/page.tsx` - Apply page (no "use client")
- `app/layout.tsx` - Root layout

### 1.2 Performance Issues Identified

1. **Initial Load Performance**
   - Entire home page requires JavaScript hydration
   - Content JSON loaded client-side
   - No static HTML pre-rendering
   - Large JavaScript bundle for initial render

2. **Animation Performance**
   - Multiple Intersection Observers (7+ instances)
   - Scroll event listeners without throttling
   - Client-side animation state management
   - No CSS-based animations for initial load

3. **Image Optimization**
   - Some images use `unoptimized` flag
   - No image preloading for above-the-fold content
   - Large hero images without priority loading

4. **Content Loading**
   - Content loaded from JSON file client-side
   - No content caching strategy
   - No incremental static regeneration

5. **Font Loading**
   - Google Fonts loaded but not optimized
   - No font-display strategy
   - Custom fonts in public folder not optimized

---

## 2. SSR Implementation Strategy

### 2.1 Priority 1: Convert Static Content to SSR

#### 2.1.1 Home Page Structure Refactoring

**Current:** Entire page is client-side  
**Target:** Hybrid approach with SSR for static content

**Implementation Steps:**

1. **Create Server Component Wrapper**
   ```typescript
   // app/page.tsx (Server Component)
   import { HomePageClient } from './home-client'
   import content from '@/data/content.json'
   
   export default async function HomePage() {
     // Content can be fetched server-side if needed
     return <HomePageClient content={content} />
   }
   ```

2. **Extract Client-Only Logic**
   ```typescript
   // app/home-client.tsx (Client Component)
   "use client"
   // Only interactive parts here
   ```

3. **Benefits:**
   - Initial HTML includes all content
   - Faster First Contentful Paint (FCP)
   - Better SEO
   - Reduced JavaScript bundle size

#### 2.1.2 Footer Component (Already SSR ✅)
- **Status:** Already server-side rendered
- **Action:** No changes needed

#### 2.1.3 Apply Page (Already SSR ✅)
- **Status:** Already server-side rendered
- **Action:** No changes needed

### 2.2 Priority 2: Component-Level SSR

#### 2.2.1 Header Component

**Current:** Client component (needs state for mobile menu)  
**Strategy:** Split into server/client components

**Implementation:**
```typescript
// components/header.tsx (Server Component)
import { HeaderClient } from './header-client'
import content from '@/data/content.json'

export function Header() {
  return <HeaderClient content={content} />
}

// components/header-client.tsx (Client Component)
"use client"
// Only mobile menu toggle logic here
```

**Benefits:**
- Navigation links rendered server-side
- Logo and static content in initial HTML
- Smaller client bundle

#### 2.2.2 Hero Component

**Current:** Client component  
**Strategy:** Server component with client wrapper for animations

**Implementation:**
```typescript
// components/hero.tsx (Server Component)
import { HeroClient } from './hero-client'
import content from '@/data/content.json'

export function Hero() {
  return <HeroClient content={content} />
}

// components/hero-client.tsx (Client Component)
"use client"
// Only animation logic here
```

**Benefits:**
- Hero content in initial HTML
- Faster Largest Contentful Paint (LCP)
- Better Core Web Vitals

### 2.3 Priority 3: Content Optimization

#### 2.3.1 Content Loading Strategy

**Current:** JSON file imported client-side  
**Options:**

1. **Keep JSON (Simple)**
   - Import in server components
   - Pass as props to client components

2. **Database/API (Scalable)**
   - Move to CMS or database
   - Use Next.js API routes
   - Implement ISR (Incremental Static Regeneration)

**Recommended:** Start with Option 1, migrate to Option 2 when needed

---

## 3. Animation Optimization Strategy

### 3.1 Current Animation Issues

1. **Too Many Intersection Observers**
   - 7+ observers on home page
   - Each creates separate observer instance
   - No observer reuse

2. **Scroll Event Listeners**
   - Direct scroll listener for image scaling
   - No throttling/debouncing
   - Performance impact on scroll

3. **Client-Side Animation State**
   - All animations trigger after hydration
   - No CSS-based initial animations
   - Flash of unstyled content (FOUC)

### 3.2 Optimization Solutions

#### 3.2.1 Unified Intersection Observer

**Create a shared observer hook:**
```typescript
// hooks/useIntersectionObserver.ts
export function useIntersectionObserver(
  ref: RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  // Single observer instance, multiple targets
}
```

**Benefits:**
- Single observer instance
- Better performance
- Easier to manage

#### 3.2.2 CSS-Based Initial Animations

**Strategy:** Use CSS for initial animations, JavaScript for scroll-triggered

```css
/* app/globals.css */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-on-load {
  animation: fadeInUp 0.6s ease-out;
}
```

**Benefits:**
- Animations work before JavaScript loads
- No FOUC
- Better perceived performance

#### 3.2.3 Throttled Scroll Handlers

**Implementation:**
```typescript
// Use requestAnimationFrame for scroll handlers
useEffect(() => {
  let rafId: number
  const handleScroll = () => {
    rafId = requestAnimationFrame(() => {
      // Scroll logic here
    })
  }
  // ...
}, [])
```

#### 3.2.4 Reduce Animation Complexity

**Current:** Multiple staggered animations  
**Optimization:**
- Reduce animation delays
- Use CSS transitions where possible
- Batch DOM updates

---

## 4. Image Optimization

### 4.1 Current Issues

1. Some images use `unoptimized={true}`
2. No priority loading for hero images
3. No image preloading
4. Large images without size optimization

### 4.2 Optimization Plan

#### 4.2.1 Remove `unoptimized` Flag

**Files to update:**
- `components/hero.tsx` - Hero background
- `components/ui/timeline.tsx` - Timeline images
- `components/ui/testimonialCard.tsx` - Profile images

**Action:** Remove `unoptimized` and let Next.js optimize

#### 4.2.2 Add Priority Loading

```typescript
// Hero images
<Image
  src={heroImage}
  priority
  fill
  alt="Hero"
/>
```

**Priority images:**
- Hero background
- Above-the-fold images
- Logo

#### 4.2.3 Implement Image Preloading

```typescript
// In layout or head
<link
  rel="preload"
  as="image"
  href="/images/home/hero.png"
/>
```

#### 4.2.4 Responsive Images

```typescript
<Image
  src={image}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  // ...
/>
```

---

## 5. Font Optimization

### 5.1 Current State

- Google Fonts (Geist) loaded via Next.js font optimization ✅
- Custom fonts in `/public/fonts/` not optimized

### 5.2 Optimization Plan

#### 5.2.1 Optimize Custom Fonts

```typescript
// app/layout.tsx
import localFont from 'next/font/local'

const firaSans = localFont({
  src: './fonts/Fira_Sans/FiraSans-Regular.ttf',
  display: 'swap',
  variable: '--font-fira-sans',
})
```

#### 5.2.2 Font Display Strategy

- Use `font-display: swap` for all fonts
- Preload critical fonts
- Subset fonts if possible

---

## 6. Code Splitting & Dynamic Imports

### 6.1 Current Usage

- `CenteredSection` already dynamically imported ✅
- Timeline section could be lazy loaded

### 6.2 Expansion Plan

#### 6.2.1 Lazy Load Below-the-Fold Components

```typescript
// app/page.tsx
const TimelineSection = dynamic(() => import('@/components/ui/timeline'), {
  loading: () => <TimelineSkeleton />,
  ssr: false, // Only if not needed for SEO
})
```

**Candidates for lazy loading:**
- Timeline section
- Testimonials section
- Newsletter subscription

#### 6.2.2 Route-Based Code Splitting

- Already handled by Next.js App Router ✅
- Ensure proper loading states

---

## 7. Caching Strategy

### 7.1 Static Content Caching

**Implementation:**
```typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### 7.2 ISR for Content Pages

**If content moves to CMS:**
```typescript
export const revalidate = 3600 // Revalidate every hour
```

---

## 8. Bundle Size Optimization

### 8.1 Current Dependencies

- Large Radix UI component library
- FontAwesome (not actively used?)
- Multiple animation libraries

### 8.2 Optimization Actions

1. **Remove Unused Dependencies**
   - Audit FontAwesome usage
   - Remove if not needed

2. **Tree Shaking**
   - Ensure proper imports
   - Use named imports from libraries

3. **Bundle Analysis**
   ```bash
   npm install @next/bundle-analyzer
   ```
   - Identify large dependencies
   - Optimize or replace

---

## 9. Implementation Roadmap

### Phase 1: Quick Wins (Week 1)
- [ ] Remove `unoptimized` flags from images
- [ ] Add `priority` to hero images
- [ ] Implement unified Intersection Observer hook
- [ ] Add CSS-based initial animations
- [ ] Throttle scroll event handlers

**Expected Impact:** 20-30% improvement in LCP, 15-20% reduction in JavaScript bundle

### Phase 2: SSR Foundation (Week 2-3)
- [ ] Split home page into server/client components
- [ ] Convert Header to hybrid SSR
- [ ] Convert Hero to hybrid SSR
- [ ] Move content loading to server-side

**Expected Impact:** 40-50% improvement in FCP, 30-40% improvement in TTI

### Phase 3: Advanced Optimizations (Week 4)
- [ ] Implement lazy loading for below-the-fold components
- [ ] Optimize custom fonts
- [ ] Add image preloading
- [ ] Implement caching headers
- [ ] Bundle size optimization

**Expected Impact:** 10-15% additional improvement, better Core Web Vitals

### Phase 4: Monitoring & Refinement (Ongoing)
- [ ] Set up performance monitoring (Vercel Analytics ✅)
- [ ] Regular Lighthouse audits
- [ ] User experience metrics tracking
- [ ] Continuous optimization

---

## 10. Performance Metrics Targets

### Current (Estimated)
- **FCP (First Contentful Paint):** ~2.5s
- **LCP (Largest Contentful Paint):** ~3.5s
- **TTI (Time to Interactive):** ~4.5s
- **TBT (Total Blocking Time):** ~800ms
- **CLS (Cumulative Layout Shift):** ~0.15

### Target (After Optimization)
- **FCP:** < 1.5s (40% improvement)
- **LCP:** < 2.5s (30% improvement)
- **TTI:** < 3.0s (35% improvement)
- **TBT:** < 300ms (60% improvement)
- **CLS:** < 0.1 (35% improvement)

### Core Web Vitals Goals
- **LCP:** Good (< 2.5s)
- **FID/INP:** Good (< 100ms)
- **CLS:** Good (< 0.1)

---

## 11. Testing Strategy

### 11.1 Performance Testing Tools

1. **Lighthouse CI**
   - Automated performance testing
   - Track metrics over time

2. **WebPageTest**
   - Real-world performance testing
   - Multiple locations/devices

3. **Chrome DevTools**
   - Performance profiling
   - Network analysis

### 11.2 Testing Checklist

- [ ] Test on slow 3G connection
- [ ] Test on mobile devices
- [ ] Test with JavaScript disabled (SSR fallback)
- [ ] Test with ad blockers
- [ ] Test on various browsers

---

## 12. Risk Assessment

### 12.1 Potential Risks

1. **Breaking Changes**
   - **Risk:** Medium
   - **Mitigation:** Incremental migration, thorough testing

2. **SEO Impact**
   - **Risk:** Low (SSR improves SEO)
   - **Mitigation:** Monitor search rankings

3. **Development Complexity**
   - **Risk:** Medium
   - **Mitigation:** Clear documentation, code reviews

### 12.2 Rollback Plan

- Keep current implementation in a branch
- Feature flags for gradual rollout
- Monitor error rates and performance

---

## 13. Success Criteria

### 13.1 Performance Metrics
- ✅ Lighthouse score > 90
- ✅ Core Web Vitals all "Good"
- ✅ Bundle size reduction > 30%

### 13.2 User Experience
- ✅ Faster perceived load time
- ✅ Smoother animations
- ✅ No layout shifts

### 13.3 Business Metrics
- ✅ Improved SEO rankings
- ✅ Lower bounce rate
- ✅ Higher conversion rate

---

## 14. Resources & References

### 14.1 Next.js Documentation
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

### 14.2 Performance Best Practices
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)

### 14.3 Tools
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [WebPageTest](https://www.webpagetest.org/)

---

## 15. Conclusion

This performance audit identifies significant opportunities to improve the New Purpose House website through Server-Side Rendering, animation optimization, and performance best practices. The phased implementation approach ensures minimal risk while delivering substantial performance improvements.

**Key Takeaways:**
1. Current architecture is heavily client-side, limiting performance
2. SSR implementation will significantly improve initial load times
3. Animation optimizations will create smoother user experience
4. Image and font optimizations are quick wins with high impact
5. Phased approach allows for incremental improvements

**Next Steps:**
1. Review and approve this plan
2. Begin Phase 1 implementation
3. Set up performance monitoring
4. Execute roadmap phases

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Author:** Performance Audit Team

