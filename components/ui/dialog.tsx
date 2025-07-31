'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return <div>{children}</div>;
};

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          'h-10 px-4 py-2',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DialogTrigger.displayName = 'DialogTrigger';

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
DialogDescription.displayName = 'DialogDescription';

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DialogFooter.displayName = 'DialogFooter';

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
