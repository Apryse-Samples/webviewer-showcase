'use client';

import Header from '@/lib/components/shared/Header';
import WebViewerWrap from '@/lib/components/shared/WebViewer';
import { theme } from '@/lib/theme';
import { ChakraProvider as ChakraP } from '@chakra-ui/provider';
import { Box, Divider, Flex, HStack, VStack } from '@chakra-ui/react';
import { usePathname } from 'next/navigation'

export const ChakraProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const pathname = usePathname()

    return (
    <ChakraP theme={theme}>
      <Flex>
        <VStack flex={1} spacing={0} >
          <Header />
          <HStack alignItems="start" width={"100%"} spacing={0}>
              <WebViewerWrap />
              {pathname !== "/" &&
                <VStack width={"520px"} >
                  <Divider />
                  {children}
                </VStack>
              }
          </HStack>
        </VStack>
      </Flex>
      </ChakraP>
     )
}