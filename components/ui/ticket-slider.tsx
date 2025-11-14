'use client'

import { useMemo, useState, useLayoutEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type TicketSliderItem = {
  id: string
  content: ReactNode
}

type TicketSliderProps = {
  items: TicketSliderItem[]
  className?: string
  peek?: number
  gap?: number
  initialIndex?: number
  onIndexChange?: (index: number) => void
}

export function TicketSlider({
  items,
  className,
  peek = 32,
  gap = 16,
  initialIndex = 0,
  onIndexChange,
}: TicketSliderProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const dragStartXRef = useRef(0)
  const dragLastTranslateRef = useRef(0)
  const dragDeltaRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const activePointerIdRef = useRef<number | null>(null)

  const slidesMeta = useMemo(() => {
    if (items.length === 0) return []
    return items.map((_, index) => ({ index }))
  }, [items])

  useLayoutEffect(() => {
    const safeIndex = Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
    setActiveIndex(safeIndex)
    setTranslateX(0)
  }, [items.length, initialIndex])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || slidesMeta.length === 0) return

    const trackChildren = Array.from(track.children) as HTMLElement[]
    const nextIndex = Math.max(0, Math.min(activeIndex, trackChildren.length - 1))
    const currentSlide = trackChildren[nextIndex]
    if (!currentSlide) return

    const viewportRect = viewport.getBoundingClientRect()
    const slideRect = currentSlide.getBoundingClientRect()
    const viewportCenter = viewportRect.left + viewportRect.width / 2
    const slideCenter = slideRect.left + slideRect.width / 2
    const delta = viewportCenter - slideCenter
    setTranslateX((prev) => prev + delta)
  }, [activeIndex, slidesMeta.length])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.style.transform = `translateX(${translateX}px)`
  }, [translateX])

  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, items.length - 1))
    setActiveIndex(clamped)
    onIndexChange?.(clamped)
  }

  const handlePrevious = () => scrollToIndex(activeIndex - 1)
  const handleNext = () => scrollToIndex(activeIndex + 1)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      handlePrevious()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      handleNext()
    }
  }

  const isAtStart = activeIndex === 0
  const isAtEnd = activeIndex === items.length - 1

  const beginDrag = (clientX: number, options?: { pointerId?: number }) => {
    if (items.length <= 1) return

    const track = trackRef.current
    if (!track) return

    track.style.transition = 'none'
    setIsDragging(true)
    dragStartXRef.current = clientX
    dragLastTranslateRef.current = translateX
    dragDeltaRef.current = 0
    activePointerIdRef.current = options?.pointerId ?? null

    if (options?.pointerId != null) {
      track.setPointerCapture(options.pointerId)
    }
  }

  const updateDrag = (clientX: number) => {
    const delta = clientX - dragStartXRef.current
    dragDeltaRef.current = delta

    const renderer = () => {
      const next = dragLastTranslateRef.current + delta
      setTranslateX(next)
      rafRef.current = null
    }

    if (rafRef.current == null) {
      rafRef.current = window.requestAnimationFrame(renderer)
    }
  }

  const finishDrag = (options?: { pointerId?: number }) => {
    if (!isDragging) return

    setIsDragging(false)

    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const track = trackRef.current
    if (!track) return

    if (options?.pointerId != null && track.hasPointerCapture?.(options.pointerId)) {
      track.releasePointerCapture(options.pointerId)
    }

    track.style.transition = ''

    const delta = dragDeltaRef.current
    const trackChildren = Array.from(track.children) as HTMLElement[]
    const currentSlide = trackChildren[activeIndex]
    const slideWidth = currentSlide?.getBoundingClientRect().width ?? 0
    const dynamicThreshold = slideWidth ? slideWidth / 3 : 60
    const threshold = Math.max(40, dynamicThreshold)

    if (delta > threshold && !isAtStart) {
      scrollToIndex(activeIndex - 1)
    } else if (delta < -threshold && !isAtEnd) {
      scrollToIndex(activeIndex + 1)
    } else {
      setTranslateX(dragLastTranslateRef.current)
    }

    dragDeltaRef.current = 0
    activePointerIdRef.current = null
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.buttons !== 1) return
    beginDrag(event.clientX, { pointerId: event.pointerId })
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    event.preventDefault()
    updateDrag(event.clientX)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    updateDrag(event.clientX)
    finishDrag({ pointerId: event.pointerId })
  }

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    updateDrag(event.clientX)
    finishDrag({ pointerId: activePointerIdRef.current ?? undefined })
  }

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    finishDrag({ pointerId: event.pointerId })
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 0) return
    const touch = event.touches[0]
    beginDrag(touch.clientX)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    if (event.touches.length === 0) return
    event.preventDefault()
    updateDrag(event.touches[0].clientX)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const touch = event.changedTouches[0]
    if (touch) {
      updateDrag(touch.clientX)
    }
    finishDrag()
  }

  const handleTouchCancel = () => {
    if (!isDragging) return
    finishDrag()
  }

  return (
    <div
      className={cn('relative flex flex-col items-center gap-3 outline-none', className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="票券滑動檢視"
    >
      <div className="relative w-full">
        <div
          ref={viewportRef}
          className="overflow-hidden relative"
          style={{
            paddingLeft: peek,
            paddingRight: peek,
            touchAction: 'pan-y',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {!isAtStart && (
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background via-background/70 to-transparent" />
          )}
          {!isAtEnd && (
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background via-background/70 to-transparent" />
          )}
          <div
            ref={trackRef}
            className={cn(
              'flex will-change-transform',
              isDragging ? '' : 'transition-transform duration-300 ease-out',
            )}
            style={{ gap }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          >
            {items.map((item) => (
              <div key={item.id} className="flex-shrink-0">
                {item.content}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className={cn(
            'absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm transition-opacity',
            'h-8 w-8 flex items-center justify-center text-sm',
            isAtStart ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-muted',
          )}
          onClick={handlePrevious}
          aria-label="上一張票券"
        >
          ‹
        </button>
        <button
          type="button"
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm transition-opacity',
            'h-8 w-8 flex items-center justify-center text-sm',
            isAtEnd ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-muted',
          )}
          onClick={handleNext}
          aria-label="下一張票券"
        >
          ›
        </button>
      </div>
      <div className="flex items-center gap-2">
        {slidesMeta.map((slide) => (
          <button
            key={slide.index}
            type="button"
            onClick={() => scrollToIndex(slide.index)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              slide.index === activeIndex ? 'w-6 bg-foreground' : 'w-2 bg-muted-foreground/40',
            )}
            aria-label={`切換到第 ${slide.index + 1} 張`}
            aria-current={slide.index === activeIndex}
          />
        ))}
      </div>
    </div>
  )
}

