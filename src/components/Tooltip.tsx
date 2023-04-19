import React, { useMemo, useRef, useState } from 'react';
import {
  arrow,
  flip,
  offset,
  Placement,
  shift,
  useFloating,
  autoUpdate,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useClick,
} from '@floating-ui/react';
import './Tooltip.scss';

export type TooltipEvent = 'hover' | 'click';

interface TooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  event?: TooltipEvent;
  place?: Placement;
  clickOptions?: {
    autoHide: boolean;
    timeout: number;
  };
  options?: {
    offset?: number;
  };
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  place = 'top',
  event = 'hover',
  clickOptions,
  options,
}) => {
  const triangle = useRef<HTMLDivElement>(undefined);
  const [open, setOpen] = useState(false);
  const { x, y, reference, floating, strategy, context, middlewareData, placement } =
    useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [
        offset(options?.offset || 10),
        flip(),
        shift({ padding: 10 }),
        arrow({ element: triangle, padding: 4 }),
      ],
      whileElementsMounted: autoUpdate,
      placement: place,
      strategy: 'fixed',
    });
  const click = useClick(context, { enabled: event === 'click' });
  const hover = useHover(context, { enabled: event === 'hover', move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    hover,
    focus,
    dismiss,
    role,
  ]);
  const staticSide = useMemo(() => {
    return {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[placement.split('-')[0]];
  }, [placement]);

  return (
    <>
      <div
        className="cursor-pointer"
        ref={reference}
        {...getReferenceProps({
          onClick() {
            if (!clickOptions?.autoHide) {
              return;
            }
            setTimeout(() => {
              setOpen(false);
            }, clickOptions?.timeout);
          },
        })}
      >
        {children || (
          <div className="question-mark-icon h-14px w-14px op-50 hover-op-100 mx-5px"></div>
        )}
      </div>
      {open && (
        <div
          className="py-6px px-12px bg-#4f5154 rounded-4px z-99999 max-w-[calc(100%-20px)]"
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
          {...getFloatingProps()}
        >
          {typeof content === 'string' ? (
            <span
              className="color-white text-justify text-13px leading-20px"
              dangerouslySetInnerHTML={{ __html: content }}
            ></span>
          ) : (
            content
          )}
          <div
            className="absolute bg-#4f5154 w-8px h-8px rotate-45deg"
            ref={triangle}
            style={{
              left: middlewareData?.arrow?.x || '',
              top: middlewareData?.arrow?.y || '',
              right: '',
              bottom: '',
              [staticSide]: -4,
            }}
          />
        </div>
      )}
    </>
  );
};
