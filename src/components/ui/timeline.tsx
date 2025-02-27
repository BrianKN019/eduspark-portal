
import * as React from "react"
import { cn } from "@/lib/utils"

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  children: React.ReactNode
}

interface TimelineContextValue {
  orientation: "horizontal" | "vertical"
}

const TimelineContext = React.createContext<TimelineContextValue | undefined>(undefined)

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, orientation = "vertical", children, ...props }, ref) => {
    return (
      <TimelineContext.Provider value={{ orientation }}>
        <div 
          ref={ref} 
          className={cn(
            "group/timeline relative",
            className
          )} 
          data-orientation={orientation}
          {...props}
        >
          {children}
        </div>
      </TimelineContext.Provider>
    )
  }
)
Timeline.displayName = "Timeline"

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step?: number
  completed?: boolean
  children: React.ReactNode
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, step, completed, children, ...props }, ref) => {
    const context = React.useContext(TimelineContext)
    if (!context) {
      throw new Error("TimelineItem must be used within a Timeline")
    }

    return (
      <div 
        ref={ref} 
        className={cn(
          "group/timeline-item relative",
          context.orientation === "horizontal" ? "flex-1" : "pb-8 pl-10",
          "last:pb-0",
          className
        )} 
        data-completed={completed ? "true" : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TimelineItem.displayName = "TimelineItem"

interface TimelineHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TimelineHeader = React.forwardRef<HTMLDivElement, TimelineHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          "flex items-center relative",
          className
        )} 
        {...props}
      >
        {children}
      </div>
    )
  }
)
TimelineHeader.displayName = "TimelineHeader"

interface TimelineTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

const TimelineTitle = React.forwardRef<HTMLHeadingElement, TimelineTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 
        ref={ref} 
        className={cn(
          "text-sm font-medium",
          className
        )} 
        {...props}
      >
        {children}
      </h3>
    )
  }
)
TimelineTitle.displayName = "TimelineTitle"

interface TimelineIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const TimelineIndicator = React.forwardRef<HTMLDivElement, TimelineIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(TimelineContext)
    if (!context) {
      throw new Error("TimelineIndicator must be used within a Timeline")
    }

    return (
      <div 
        ref={ref} 
        className={cn(
          "absolute flex h-6 w-6 items-center justify-center rounded-full border bg-background",
          context.orientation === "vertical" ? "left-0 -translate-x-1/2" : "top-0 -translate-y-1/2",
          className
        )} 
        {...props}
      >
        {children}
      </div>
    )
  }
)
TimelineIndicator.displayName = "TimelineIndicator"

interface TimelineSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimelineSeparator = React.forwardRef<HTMLDivElement, TimelineSeparatorProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(TimelineContext)
    if (!context) {
      throw new Error("TimelineSeparator must be used within a Timeline")
    }

    return (
      <div 
        ref={ref} 
        className={cn(
          "absolute bg-border",
          context.orientation === "vertical" 
            ? "left-3 top-0 h-full w-px -translate-x-1/2" 
            : "top-3 left-0 h-px w-full -translate-y-1/2",
          className
        )} 
        {...props}
      />
    )
  }
)
TimelineSeparator.displayName = "TimelineSeparator"

interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          "mt-2",
          className
        )} 
        {...props}
      >
        {children}
      </div>
    )
  }
)
TimelineContent.displayName = "TimelineContent"

interface TimelineDateProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const TimelineDate = React.forwardRef<HTMLParagraphElement, TimelineDateProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p 
        ref={ref} 
        className={cn(
          "text-xs text-muted-foreground mt-1",
          className
        )} 
        {...props}
      >
        {children}
      </p>
    )
  }
)
TimelineDate.displayName = "TimelineDate"

export {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineTitle,
  TimelineIndicator,
  TimelineSeparator,
  TimelineContent,
  TimelineDate,
}
