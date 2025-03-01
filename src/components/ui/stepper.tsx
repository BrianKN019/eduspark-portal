
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, Circle } from "lucide-react"

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
      if (value !== undefined) {
        setStep(value)
      }
    }, [value])

    return (
      <div
        ref={ref}
        className={cn(
          "group/stepper",
          orientation === "horizontal" 
            ? "flex w-full flex-row justify-between" 
            : "flex w-full flex-col gap-2",
          className
        )}
        data-orientation={orientation}
        {...props}
      >
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              // Only pass allowed props to avoid object literal type error
              value: step,
              onValueChange: handleStepChange,
            } as React.ComponentProps<typeof StepperItem>)
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
          "group-data-[orientation=horizontal]/stepper:h-[2px] group-data-[orientation=horizontal]/stepper:w-full",
          "group-data-[orientation=vertical]/stepper:h-full group-data-[orientation=vertical]/stepper:w-[2px]",
          "bg-gray-200 dark:bg-gray-700 group-data-[completed]/stepper-item:bg-green-500 transition-colors duration-300",
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
          "group-data-[completed]/stepper-item:text-green-600 dark:group-data-[completed]/stepper-item:text-green-500",
          "group-data-[active]/stepper-item:text-blue-600 dark:group-data-[active]/stepper-item:text-blue-500",
          "transition-colors duration-300",
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
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-center text-sm font-medium",
          "text-gray-700 dark:text-gray-300",
          "group-data-[active]/stepper-item:border-blue-600 group-data-[active]/stepper-item:text-blue-600",
          "group-data-[active]/stepper-item:dark:border-blue-500 group-data-[active]/stepper-item:dark:text-blue-500",
          "group-data-[completed]/stepper-item:border-green-600 group-data-[completed]/stepper-item:bg-green-100",
          "group-data-[completed]/stepper-item:dark:border-green-500 group-data-[completed]/stepper-item:dark:bg-green-900",
          "transition-all duration-300 ease-in-out",
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
StepperIndicator.displayName = "StepperIndicator"

interface StepperIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  step: number
  value?: number
}

const StepperIcon = React.forwardRef<HTMLSpanElement, StepperIconProps>(
  ({ step, value, ...props }, ref) => {
    const isActive = value === step
    const isCompleted = value != null && step < value

    return (
      <span ref={ref} {...props}>
        {isCompleted ? (
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
        ) : (
          isActive ? (
            <Circle className="h-6 w-6 text-blue-600 dark:text-blue-500 fill-blue-100 dark:fill-blue-900" />
          ) : (
            <Circle className="h-6 w-6 text-gray-400 dark:text-gray-600" />
          )
        )}
      </span>
    )
  }
)
StepperIcon.displayName = "StepperIcon"

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
          "group-data-[orientation=horizontal]/stepper:mt-4",
          "group-data-[orientation=vertical]/stepper:ml-10 group-data-[orientation=vertical]/stepper:pt-1",
          "transition-all duration-300 ease-in-out",
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
  StepperIcon,
  StepperTitle,
  StepperContent,
}
