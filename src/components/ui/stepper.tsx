
import * as React from "react"
import { cn } from "@/lib/utils"

interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultValue?: number
  value?: number
  onChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
  children: React.ReactNode
}

interface StepperContextValue {
  value: number
  setValue: (value: number) => void
  orientation: "horizontal" | "vertical"
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined)

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, defaultValue = 1, value, onChange, orientation = "horizontal", children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const actualValue = value !== undefined ? value : internalValue
    
    const setValue = React.useCallback((newValue: number) => {
      setInternalValue(newValue)
      onChange?.(newValue)
    }, [onChange])

    return (
      <StepperContext.Provider value={{ value: actualValue, setValue, orientation }}>
        <div 
          ref={ref} 
          className={cn(
            "group/stepper",
            orientation === "horizontal" ? "flex items-center justify-between" : "flex flex-col",
            className
          )} 
          data-orientation={orientation}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    )
  }
)
Stepper.displayName = "Stepper"

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  completed?: boolean
  children: React.ReactNode
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ className, step, completed, children, ...props }, ref) => {
    const context = React.useContext(StepperContext)
    if (!context) {
      throw new Error("StepperItem must be used within a Stepper")
    }

    const isActive = step === context.value
    const isCompleted = completed || step < context.value

    return (
      <div 
        ref={ref} 
        className={cn(
          "flex",
          context.orientation === "horizontal" ? "flex-col" : "flex-row",
          className
        )} 
        data-active={isActive ? "true" : undefined}
        data-completed={isCompleted ? "true" : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepperItem.displayName = "StepperItem"

interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(StepperContext)
    if (!context) {
      throw new Error("StepperTrigger must be used within a Stepper")
    }

    return (
      <button 
        ref={ref} 
        className={cn(
          "flex items-center gap-2",
          className
        )} 
        {...props}
      >
        {children}
      </button>
    )
  }
)
StepperTrigger.displayName = "StepperTrigger"

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    const stepItem = React.useContext(StepperItemContext)
    
    return (
      <div 
        ref={ref} 
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border text-sm transition-colors",
          "group-data-[active=true]/stepper-item:border-primary group-data-[active=true]/stepper-item:bg-primary group-data-[active=true]/stepper-item:text-primary-foreground",
          "group-data-[completed=true]/stepper-item:border-primary group-data-[completed=true]/stepper-item:bg-primary group-data-[completed=true]/stepper-item:text-primary-foreground",
          className
        )} 
        {...props}
      >
        {children || (stepItem?.step || "")}
      </div>
    )
  }
)
StepperIndicator.displayName = "StepperIndicator"

interface StepperTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

const StepperTitle = React.forwardRef<HTMLHeadingElement, StepperTitleProps>(
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
StepperTitle.displayName = "StepperTitle"

interface StepperSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const StepperSeparator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(StepperContext)
    if (!context) {
      throw new Error("StepperSeparator must be used within a Stepper")
    }

    return (
      <div 
        ref={ref} 
        className={cn(
          "absolute",
          context.orientation === "horizontal" 
            ? "top-3 left-0 h-px w-full" 
            : "left-3 top-0 w-px h-full",
          "bg-primary/20 group-data-[completed=true]/stepper-item:bg-primary",
          className
        )} 
        {...props}
      />
    )
  }
)
StepperSeparator.displayName = "StepperSeparator"

// Context for StepperItem to pass step value to StepperIndicator
interface StepperItemContextValue {
  step: number
}

const StepperItemContext = React.createContext<StepperItemContextValue | undefined>(undefined)

// Wrap the StepperItem to provide context
const WrappedStepperItem: React.FC<StepperItemProps> = ({ children, step, ...props }) => {
  return (
    <StepperItemContext.Provider value={{ step }}>
      <StepperItem step={step} {...props} className="group/stepper-item">
        {children}
      </StepperItem>
    </StepperItemContext.Provider>
  )
}

export {
  Stepper,
  WrappedStepperItem as StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
}
