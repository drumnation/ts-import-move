import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { BottomSheetProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/MobileLayout/components/BottomSheet/BottomSheet.types';
import { sheetVariants, backdropVariants } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/MobileLayout/components/BottomSheet/BottomSheet.logic';
import {
  BottomSheet as StyledBottomSheet,
  SheetHandle,
  SheetHeader,
  SheetTitle,
  SheetContent,
  Backdrop
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/MobileLayout/components/BottomSheet/BottomSheet.styles';

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  sheetType,
  title,
  children,
  touchConfig,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Backdrop
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Sheet */}
          <StyledBottomSheet
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SheetHandle touchConfig={touchConfig} onClick={onClose} />
            
            <SheetHeader touchConfig={touchConfig}>
              <SheetTitle>{title}</SheetTitle>
              <ActionIcon
                size={touchConfig.minSize}
                variant="light"
                onClick={onClose}
              >
                <IconX size={20} />
              </ActionIcon>
            </SheetHeader>
            
            <SheetContent>
              {children}
            </SheetContent>
          </StyledBottomSheet>
        </>
      )}
    </AnimatePresence>
  );
}; 