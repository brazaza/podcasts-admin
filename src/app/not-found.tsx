"use client";

import NextTopLoader from 'nextjs-toploader'
import ErrorReporter from '@/components/ErrorReporter'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { NotFoundContent } from '@/components/not-found-content'
import '@/app/(frontend)/globals.css'

export default function GlobalNotFound() {
  return (
        <LayoutWrapper>
          <NotFoundContent />
        </LayoutWrapper>
  );
}
