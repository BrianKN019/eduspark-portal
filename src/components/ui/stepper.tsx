
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultValue?: number
  value?: number
  onChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, defaultValue, value, onChange, orientation = "horizontal", ...props }, ref) => {
    const [step, setStep] = React.useState(value || defaultValue || 1)

    const handleStepChange = React.useCallback(
      (step: number) => {
        setStep(step)
        onChange?.(step)
      },
      [onChange]
    )

    React.useEffect(() => {
      if (value) {
        setStep(value)
      }
    }, [value])

    return (
      <div
        ref={ref}
        className={cn(
          "group/stepper",
          orientation === "horizontal" ? "flex w-full flex-row justify-between" : "flex w-full flex-col gap-2",
          className
        )}
        data-orientation={orientation}
        {...props}
      >
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              value: step,
              onValueChange: handleStepChange,
            })
          }
          return child
        })}
      </div>
    )
  }
)
Stepper.displayName = "Stepper"

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  value?: number
  completed?: boolean
  onValueChange?: (value: number) => void
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ className, step, value, onValueChange, completed = false, ...props }, ref) => {
    const isActive = value === step
    const isCompleted = completed || (value != null && step < value)

    return (
      <div
        ref={ref}
        data-active={isActive}
        data-completed={isCompleted}
        className={cn(
          "group/stepper-item",
          "relative flex",
          className
        )}
        {...props}
      />
    )
  }
)
StepperItem.displayName = "StepperItem"

interface StepperSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const StepperSeparator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group-data-[orientation=horizontal]/stepper:h-[1px] group-data-[orientation=horizontal]/stepper:w-full",
          "group-data-[orientation=vertical]/stepper:h-full group-data-[orientation=vertical]/stepper:w-[1px]",
          "bg-border group-data-[completed]/stepper-item:bg-primary",
          className
        )}
        {...props}
      />
    )
  }
)
StepperSeparator.displayName = "StepperSeparator"

interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="tab"
        className={cn(
          "flex max-w-full items-center gap-2 px-2 py-1 text-muted-foreground",
          "group-data-[completed]/stepper-item:text-foreground group-data-[active]/stepper-item:text-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
StepperTrigger.displayName = "StepperTrigger"

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {}

const StepperIndicator = React.forwardRef<HTMLSpanElement, StepperIndicatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-center text-xs",
          "bg-background text-foreground",
          "group-data-[active]/stepper-item:border-primary group-data-[active]/stepper-item:text-primary",
          "group-data-[completed]/stepper-item:border-primary group-data-[completed]/stepper-item:bg-primary group-data-[completed]/stepper-item:text-primary-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
StepperIndicator.displayName = "StepperIndicator"

interface StepperTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const StepperTitle = React.forwardRef<HTMLHeadingElement, StepperTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-sm font-medium",
          className
        )}
        {...props}
      />
    )
  }
)
StepperTitle.displayName = "StepperTitle"

interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group-data-[orientation=horizontal]/stepper:mt-2",
          "group-data-[orientation=vertical]/stepper:ml-8 group-data-[orientation=vertical]/stepper:pt-1 group-data-[orientation=vertical]/stepper:pl-4",
          className
        )}
        {...props}
      />
    )
  }
)
StepperContent.displayName = "StepperContent"

export {
  Stepper,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperContent,
}
