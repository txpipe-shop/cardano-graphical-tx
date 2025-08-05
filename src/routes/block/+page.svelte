<script lang="ts">
  import { Card, CardContent } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import { Input } from '@/components/ui/input';
  import { ScrollArea } from '@/components/ui/scroll-area';

  //export let data;
  const data = {
    transactions: [
      {
        fee: 497336n,
        hash: '14fff182c637fbdfe7dbbd537d781e9410160228f252637b9a6320d07b4043e4',
        inputs: [
          {
            address: '60d1c8440c413602831158ca3aadf928e024aca50dcbb5c520d626d0db',
            coin: 9000000n,
            outRef: {
              hash: '14fff182c637fbdfe7dbbd537d781e9410160228f252637b9a6320d07b4043e4',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6',
            coin: 2000000n,
            outRef: {
              hash: '14fff182c637fbdfe7dbbd537d781e9410160228f252637b9a6320d07b4043e4',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60d1c8440c413602831158ca3aadf928e024aca50dcbb5c520d626d0db',
            coin: 12375394n,
            outRef: {
              hash: '14fff182c637fbdfe7dbbd537d781e9410160228f252637b9a6320d07b4043e4',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '70575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6',
            coin: 2000000n,
            outRef: {
              hash: '14fff182c637fbdfe7dbbd537d781e9410160228f252637b9a6320d07b4043e4',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60d1c8440c413602831158ca3aadf928e024aca50dcbb5c520d626d0db',
            coin: 9000000n,
            outRef: {
              hash: '14fff182c637fbdfe7dbbd537d781e9410160228f252637b9a6320d07b4043e4',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60d1c8440c413602831158ca3aadf928e024aca50dcbb5c520d626d0db',
            coin: 11878058n,
            outRef: {
              hash: '14fff182c637fbdfe7dbbd537d781e9410160228f252637b9a6320d07b4043e4',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '70575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6',
            coin: 66000000n,
            outRef: {
              hash: '14fff182c637fbdfe7dbbd537d781e9410160228f252637b9a6320d07b4043e4',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 488135n,
        hash: '5d88bfaa46e43e959febfe4e29691e85e0658161aaaad3900bdc24587844b67e',
        inputs: [
          {
            address: '701aa03457bc4ca3bc1ac8db6812dcd5a39b4c6086c61b4a73d5e0c965',
            coin: 2000000n,
            outRef: {
              hash: '5d88bfaa46e43e959febfe4e29691e85e0658161aaaad3900bdc24587844b67e',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60cb149ac08ca61a3a3bf21760f61b50bca2c2348aa49e92b3f6ab4a26',
            coin: 9000000n,
            outRef: {
              hash: '5d88bfaa46e43e959febfe4e29691e85e0658161aaaad3900bdc24587844b67e',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60cb149ac08ca61a3a3bf21760f61b50bca2c2348aa49e92b3f6ab4a26',
            coin: 8703981n,
            outRef: {
              hash: '5d88bfaa46e43e959febfe4e29691e85e0658161aaaad3900bdc24587844b67e',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '701aa03457bc4ca3bc1ac8db6812dcd5a39b4c6086c61b4a73d5e0c965',
            coin: 2000000n,
            outRef: {
              hash: '5d88bfaa46e43e959febfe4e29691e85e0658161aaaad3900bdc24587844b67e',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60cb149ac08ca61a3a3bf21760f61b50bca2c2348aa49e92b3f6ab4a26',
            coin: 9000000n,
            outRef: {
              hash: '5d88bfaa46e43e959febfe4e29691e85e0658161aaaad3900bdc24587844b67e',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60cb149ac08ca61a3a3bf21760f61b50bca2c2348aa49e92b3f6ab4a26',
            coin: 8215846n,
            outRef: {
              hash: '5d88bfaa46e43e959febfe4e29691e85e0658161aaaad3900bdc24587844b67e',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '701aa03457bc4ca3bc1ac8db6812dcd5a39b4c6086c61b4a73d5e0c965',
            coin: 66000000n,
            outRef: {
              hash: '5d88bfaa46e43e959febfe4e29691e85e0658161aaaad3900bdc24587844b67e',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 488842n,
        hash: '2d28ccd3bdc416d0f7bf3c34ccef572043253fb775b9fbcd3be428fc048ca1c6',
        inputs: [
          {
            address: '600c9a53641681cb81f1864f40e19c570174e882f5aa8d5dde59104ce9',
            coin: 9000000n,
            outRef: {
              hash: '2d28ccd3bdc416d0f7bf3c34ccef572043253fb775b9fbcd3be428fc048ca1c6',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '701aa03457bc4ca3bc1ac8db6812dcd5a39b4c6086c61b4a73d5e0c965',
            coin: 2000000n,
            outRef: {
              hash: '2d28ccd3bdc416d0f7bf3c34ccef572043253fb775b9fbcd3be428fc048ca1c6',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '600c9a53641681cb81f1864f40e19c570174e882f5aa8d5dde59104ce9',
            coin: 8021608n,
            outRef: {
              hash: '2d28ccd3bdc416d0f7bf3c34ccef572043253fb775b9fbcd3be428fc048ca1c6',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '701aa03457bc4ca3bc1ac8db6812dcd5a39b4c6086c61b4a73d5e0c965',
            coin: 2000000n,
            outRef: {
              hash: '2d28ccd3bdc416d0f7bf3c34ccef572043253fb775b9fbcd3be428fc048ca1c6',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '600c9a53641681cb81f1864f40e19c570174e882f5aa8d5dde59104ce9',
            coin: 9000000n,
            outRef: {
              hash: '2d28ccd3bdc416d0f7bf3c34ccef572043253fb775b9fbcd3be428fc048ca1c6',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '600c9a53641681cb81f1864f40e19c570174e882f5aa8d5dde59104ce9',
            coin: 7532766n,
            outRef: {
              hash: '2d28ccd3bdc416d0f7bf3c34ccef572043253fb775b9fbcd3be428fc048ca1c6',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '701aa03457bc4ca3bc1ac8db6812dcd5a39b4c6086c61b4a73d5e0c965',
            coin: 66000000n,
            outRef: {
              hash: '2d28ccd3bdc416d0f7bf3c34ccef572043253fb775b9fbcd3be428fc048ca1c6',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 501887n,
        hash: '9862fd1ad120397680f2905e3f7f19e735114fb897a4a2ab30a81a1a70314743',
        inputs: [
          {
            address: '609dc0a95d1a343ef38043994c4ff7b8f1f8f860339ee351bc0cb8a650',
            coin: 10324692n,
            outRef: {
              hash: '9862fd1ad120397680f2905e3f7f19e735114fb897a4a2ab30a81a1a70314743',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 2000000n,
            outRef: {
              hash: '9862fd1ad120397680f2905e3f7f19e735114fb897a4a2ab30a81a1a70314743',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '609dc0a95d1a343ef38043994c4ff7b8f1f8f860339ee351bc0cb8a650',
            coin: 9000000n,
            outRef: {
              hash: '9862fd1ad120397680f2905e3f7f19e735114fb897a4a2ab30a81a1a70314743',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 2000000n,
            outRef: {
              hash: '9862fd1ad120397680f2905e3f7f19e735114fb897a4a2ab30a81a1a70314743',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '609dc0a95d1a343ef38043994c4ff7b8f1f8f860339ee351bc0cb8a650',
            coin: 9000000n,
            outRef: {
              hash: '9862fd1ad120397680f2905e3f7f19e735114fb897a4a2ab30a81a1a70314743',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '609dc0a95d1a343ef38043994c4ff7b8f1f8f860339ee351bc0cb8a650',
            coin: 9822805n,
            outRef: {
              hash: '9862fd1ad120397680f2905e3f7f19e735114fb897a4a2ab30a81a1a70314743',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 66000000n,
            outRef: {
              hash: '9862fd1ad120397680f2905e3f7f19e735114fb897a4a2ab30a81a1a70314743',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 493481n,
        hash: '6641fee9b41ca89bf3fd84e83cdb3ec82c51fc46a8171be45c88af78b95d41dd',
        inputs: [
          {
            address: '60564b2400e0901e336538bea2eb48f0bac8aa77b0c3a948f07cd15ff0',
            coin: 9000000n,
            outRef: {
              hash: '6641fee9b41ca89bf3fd84e83cdb3ec82c51fc46a8171be45c88af78b95d41dd',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '703f89c436844cd0acd2714201817836b2cd16b082e03e3a21bb69e5ad',
            coin: 2000000n,
            outRef: {
              hash: '6641fee9b41ca89bf3fd84e83cdb3ec82c51fc46a8171be45c88af78b95d41dd',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60564b2400e0901e336538bea2eb48f0bac8aa77b0c3a948f07cd15ff0',
            coin: 8717785n,
            outRef: {
              hash: '6641fee9b41ca89bf3fd84e83cdb3ec82c51fc46a8171be45c88af78b95d41dd',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '703f89c436844cd0acd2714201817836b2cd16b082e03e3a21bb69e5ad',
            coin: 2000000n,
            outRef: {
              hash: '6641fee9b41ca89bf3fd84e83cdb3ec82c51fc46a8171be45c88af78b95d41dd',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60564b2400e0901e336538bea2eb48f0bac8aa77b0c3a948f07cd15ff0',
            coin: 9000000n,
            outRef: {
              hash: '6641fee9b41ca89bf3fd84e83cdb3ec82c51fc46a8171be45c88af78b95d41dd',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60564b2400e0901e336538bea2eb48f0bac8aa77b0c3a948f07cd15ff0',
            coin: 8224304n,
            outRef: {
              hash: '6641fee9b41ca89bf3fd84e83cdb3ec82c51fc46a8171be45c88af78b95d41dd',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '703f89c436844cd0acd2714201817836b2cd16b082e03e3a21bb69e5ad',
            coin: 64000000n,
            outRef: {
              hash: '6641fee9b41ca89bf3fd84e83cdb3ec82c51fc46a8171be45c88af78b95d41dd',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 501887n,
        hash: '2402876c9a69bd8f24c734c7d1141e424183534ae5f2cd16595f0ad5fa6d8649',
        inputs: [
          {
            address: '601b89172d8305781b594cc8eb4dcf6691628d52bfed0326dae608d1a3',
            coin: 9215455n,
            outRef: {
              hash: '2402876c9a69bd8f24c734c7d1141e424183534ae5f2cd16595f0ad5fa6d8649',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6',
            coin: 2000000n,
            outRef: {
              hash: '2402876c9a69bd8f24c734c7d1141e424183534ae5f2cd16595f0ad5fa6d8649',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '601b89172d8305781b594cc8eb4dcf6691628d52bfed0326dae608d1a3',
            coin: 9000000n,
            outRef: {
              hash: '2402876c9a69bd8f24c734c7d1141e424183534ae5f2cd16595f0ad5fa6d8649',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '70575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6',
            coin: 2000000n,
            outRef: {
              hash: '2402876c9a69bd8f24c734c7d1141e424183534ae5f2cd16595f0ad5fa6d8649',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '601b89172d8305781b594cc8eb4dcf6691628d52bfed0326dae608d1a3',
            coin: 9000000n,
            outRef: {
              hash: '2402876c9a69bd8f24c734c7d1141e424183534ae5f2cd16595f0ad5fa6d8649',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '601b89172d8305781b594cc8eb4dcf6691628d52bfed0326dae608d1a3',
            coin: 8713568n,
            outRef: {
              hash: '2402876c9a69bd8f24c734c7d1141e424183534ae5f2cd16595f0ad5fa6d8649',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '70575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6',
            coin: 66000000n,
            outRef: {
              hash: '2402876c9a69bd8f24c734c7d1141e424183534ae5f2cd16595f0ad5fa6d8649',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 496628n,
        hash: '06938de672329f2f5aab185f944f90c64fc73b3eb3bc57f317f739b5185cb904',
        inputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 2000000n,
            outRef: {
              hash: '06938de672329f2f5aab185f944f90c64fc73b3eb3bc57f317f739b5185cb904',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '603167064cf10d538328b221f7cb906d63b046ff5c3866c90484ab912c',
            coin: 9000000n,
            outRef: {
              hash: '06938de672329f2f5aab185f944f90c64fc73b3eb3bc57f317f739b5185cb904',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '603167064cf10d538328b221f7cb906d63b046ff5c3866c90484ab912c',
            coin: 9000000n,
            outRef: {
              hash: '06938de672329f2f5aab185f944f90c64fc73b3eb3bc57f317f739b5185cb904',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 2000000n,
            outRef: {
              hash: '06938de672329f2f5aab185f944f90c64fc73b3eb3bc57f317f739b5185cb904',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '603167064cf10d538328b221f7cb906d63b046ff5c3866c90484ab912c',
            coin: 9000000n,
            outRef: {
              hash: '06938de672329f2f5aab185f944f90c64fc73b3eb3bc57f317f739b5185cb904',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '603167064cf10d538328b221f7cb906d63b046ff5c3866c90484ab912c',
            coin: 8503372n,
            outRef: {
              hash: '06938de672329f2f5aab185f944f90c64fc73b3eb3bc57f317f739b5185cb904',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 66000000n,
            outRef: {
              hash: '06938de672329f2f5aab185f944f90c64fc73b3eb3bc57f317f739b5185cb904',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 1814503n,
        hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
        inputs: [
          {
            address: '60c8af1f56a059e847540188c4fb7772e37d65dac4e9d3f247ade1832b',
            coin: 9000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 3000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 2000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 3000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 3000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 2000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 3000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60c8af1f56a059e847540188c4fb7772e37d65dac4e9d3f247ade1832b',
            coin: 7185497n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 3n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '70f5542fa9d9c61b4dbccd71654cc5a72a9fddc9d563f503682e772ec9',
            coin: 2000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 2000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 2000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 2000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 3n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 2000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 4n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 66000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 5n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70ab7d3f47bc0b199e54e8ce74a042d413371ec39a1e5319fbda63ad9f',
            coin: 2000000n,
            outRef: {
              hash: 'eed1baf0b23ede7ddea42339535afba2b8d7300801355475831831376fe00f8b',
              index: 6n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 501887n,
        hash: '937ee34714a628d10aa0312dc39bcb76e85be5c80f15648f481b218674764d9e',
        inputs: [
          {
            address: '60e1b68ab08ba58f06e19a9b4047b0a40781e6d0641d43846d16034aa5',
            coin: 9000000n,
            outRef: {
              hash: '937ee34714a628d10aa0312dc39bcb76e85be5c80f15648f481b218674764d9e',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 2000000n,
            outRef: {
              hash: '937ee34714a628d10aa0312dc39bcb76e85be5c80f15648f481b218674764d9e',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60e1b68ab08ba58f06e19a9b4047b0a40781e6d0641d43846d16034aa5',
            coin: 6988875n,
            outRef: {
              hash: '937ee34714a628d10aa0312dc39bcb76e85be5c80f15648f481b218674764d9e',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 2000000n,
            outRef: {
              hash: '937ee34714a628d10aa0312dc39bcb76e85be5c80f15648f481b218674764d9e',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60e1b68ab08ba58f06e19a9b4047b0a40781e6d0641d43846d16034aa5',
            coin: 9000000n,
            outRef: {
              hash: '937ee34714a628d10aa0312dc39bcb76e85be5c80f15648f481b218674764d9e',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '60e1b68ab08ba58f06e19a9b4047b0a40781e6d0641d43846d16034aa5',
            coin: 6486988n,
            outRef: {
              hash: '937ee34714a628d10aa0312dc39bcb76e85be5c80f15648f481b218674764d9e',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 66000000n,
            outRef: {
              hash: '937ee34714a628d10aa0312dc39bcb76e85be5c80f15648f481b218674764d9e',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 496628n,
        hash: 'b6212236ecb0af60fe68b8e082194e58b029308946121482d092a85171c65e74',
        inputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 2000000n,
            outRef: {
              hash: 'b6212236ecb0af60fe68b8e082194e58b029308946121482d092a85171c65e74',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '601487aed833e2d540b8527f653445a7716584cf67e4c79aef6bbd474c',
            coin: 8501957n,
            outRef: {
              hash: 'b6212236ecb0af60fe68b8e082194e58b029308946121482d092a85171c65e74',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '601487aed833e2d540b8527f653445a7716584cf67e4c79aef6bbd474c',
            coin: 9000000n,
            outRef: {
              hash: 'b6212236ecb0af60fe68b8e082194e58b029308946121482d092a85171c65e74',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 2000000n,
            outRef: {
              hash: 'b6212236ecb0af60fe68b8e082194e58b029308946121482d092a85171c65e74',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '601487aed833e2d540b8527f653445a7716584cf67e4c79aef6bbd474c',
            coin: 9000000n,
            outRef: {
              hash: 'b6212236ecb0af60fe68b8e082194e58b029308946121482d092a85171c65e74',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '601487aed833e2d540b8527f653445a7716584cf67e4c79aef6bbd474c',
            coin: 8005329n,
            outRef: {
              hash: 'b6212236ecb0af60fe68b8e082194e58b029308946121482d092a85171c65e74',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '70a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a',
            coin: 66000000n,
            outRef: {
              hash: 'b6212236ecb0af60fe68b8e082194e58b029308946121482d092a85171c65e74',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 497336n,
        hash: '8edf06f5ff91a922d999d714d38c053a7d073e9bf71c23e81ba0939a52f5168d',
        inputs: [
          {
            address: '603f56c81cf09600e1e844cb4e0566cd6f0f88f0d82bc1ded18b885aec',
            coin: 9000000n,
            outRef: {
              hash: '8edf06f5ff91a922d999d714d38c053a7d073e9bf71c23e81ba0939a52f5168d',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '70575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6',
            coin: 2000000n,
            outRef: {
              hash: '8edf06f5ff91a922d999d714d38c053a7d073e9bf71c23e81ba0939a52f5168d',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '603f56c81cf09600e1e844cb4e0566cd6f0f88f0d82bc1ded18b885aec',
            coin: 10212469n,
            outRef: {
              hash: '8edf06f5ff91a922d999d714d38c053a7d073e9bf71c23e81ba0939a52f5168d',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '70575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6',
            coin: 2000000n,
            outRef: {
              hash: '8edf06f5ff91a922d999d714d38c053a7d073e9bf71c23e81ba0939a52f5168d',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '603f56c81cf09600e1e844cb4e0566cd6f0f88f0d82bc1ded18b885aec',
            coin: 9000000n,
            outRef: {
              hash: '8edf06f5ff91a922d999d714d38c053a7d073e9bf71c23e81ba0939a52f5168d',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '603f56c81cf09600e1e844cb4e0566cd6f0f88f0d82bc1ded18b885aec',
            coin: 9715133n,
            outRef: {
              hash: '8edf06f5ff91a922d999d714d38c053a7d073e9bf71c23e81ba0939a52f5168d',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '70575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6',
            coin: 66000000n,
            outRef: {
              hash: '8edf06f5ff91a922d999d714d38c053a7d073e9bf71c23e81ba0939a52f5168d',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 194981n,
        hash: '136fb938250205d458cf9f9b31527d2c296f0bd3831f5fdc70be6778a7d5168f',
        inputs: [
          {
            address:
              '008d6017bf00db7195290f856dfd5f0806a935a880d848747b4fc5953dfc34e2d454398f64e451d5595ccf01fa21c19fb6ef4c258194e73f8f',
            coin: 11406691n,
            outRef: {
              hash: '136fb938250205d458cf9f9b31527d2c296f0bd3831f5fdc70be6778a7d5168f',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address:
              '008d6017bf00db7195290f856dfd5f0806a935a880d848747b4fc5953dfc34e2d454398f64e451d5595ccf01fa21c19fb6ef4c258194e73f8f',
            coin: 1836060n,
            outRef: {
              hash: '136fb938250205d458cf9f9b31527d2c296f0bd3831f5fdc70be6778a7d5168f',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address:
              '008d6017bf00db7195290f856dfd5f0806a935a880d848747b4fc5953dfc34e2d454398f64e451d5595ccf01fa21c19fb6ef4c258194e73f8f',
            coin: 13500000n,
            outRef: {
              hash: '136fb938250205d458cf9f9b31527d2c296f0bd3831f5fdc70be6778a7d5168f',
              index: 4n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '7077c07de4b3b4990bea144b8ba6b5268cb9795d42bd84e599253fbe30',
            coin: 1836060n,
            outRef: {
              hash: '136fb938250205d458cf9f9b31527d2c296f0bd3831f5fdc70be6778a7d5168f',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '7077c07de4b3b4990bea144b8ba6b5268cb9795d42bd84e599253fbe30',
            coin: 10000000n,
            outRef: {
              hash: '136fb938250205d458cf9f9b31527d2c296f0bd3831f5fdc70be6778a7d5168f',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address:
              '008d6017bf00db7195290f856dfd5f0806a935a880d848747b4fc5953dfc34e2d454398f64e451d5595ccf01fa21c19fb6ef4c258194e73f8f',
            coin: 14711710n,
            outRef: {
              hash: '136fb938250205d458cf9f9b31527d2c296f0bd3831f5fdc70be6778a7d5168f',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [],
        treasury: 0n,
        treasuryDonation: 0n
      },
      {
        fee: 488223n,
        hash: 'b79ccf98d47042f338935003945e4f9745c10a4a0ce1dad9ee0b9d64d3079a3a',
        inputs: [
          {
            address: '703f89c436844cd0acd2714201817836b2cd16b082e03e3a21bb69e5ad',
            coin: 2000000n,
            outRef: {
              hash: 'b79ccf98d47042f338935003945e4f9745c10a4a0ce1dad9ee0b9d64d3079a3a',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '6059184749e2d67a7ea2ca31ef48fc0befb3c3fad5a88af7264531ae07',
            coin: 9000000n,
            outRef: {
              hash: 'b79ccf98d47042f338935003945e4f9745c10a4a0ce1dad9ee0b9d64d3079a3a',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '6059184749e2d67a7ea2ca31ef48fc0befb3c3fad5a88af7264531ae07',
            coin: 8332508n,
            outRef: {
              hash: 'b79ccf98d47042f338935003945e4f9745c10a4a0ce1dad9ee0b9d64d3079a3a',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        metadata: new Map(),
        mint: {},
        outputs: [
          {
            address: '703f89c436844cd0acd2714201817836b2cd16b082e03e3a21bb69e5ad',
            coin: 2000000n,
            outRef: {
              hash: 'b79ccf98d47042f338935003945e4f9745c10a4a0ce1dad9ee0b9d64d3079a3a',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '6059184749e2d67a7ea2ca31ef48fc0befb3c3fad5a88af7264531ae07',
            coin: 9000000n,
            outRef: {
              hash: 'b79ccf98d47042f338935003945e4f9745c10a4a0ce1dad9ee0b9d64d3079a3a',
              index: 1n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          },
          {
            address: '6059184749e2d67a7ea2ca31ef48fc0befb3c3fad5a88af7264531ae07',
            coin: 7844285n,
            outRef: {
              hash: 'b79ccf98d47042f338935003945e4f9745c10a4a0ce1dad9ee0b9d64d3079a3a',
              index: 2n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        referenceInputs: [
          {
            address: '703f89c436844cd0acd2714201817836b2cd16b082e03e3a21bb69e5ad',
            coin: 64000000n,
            outRef: {
              hash: 'b79ccf98d47042f338935003945e4f9745c10a4a0ce1dad9ee0b9d64d3079a3a',
              index: 0n
            },
            value: {},
            datum: undefined,
            referenceScript: undefined
          }
        ],
        treasury: 0n,
        treasuryDonation: 0n
      }
    ]
  };
</script>

<svelte:head>
  <title>Transactions</title>
</svelte:head>

<div class="space-y-6 p-6">
  <h1>Transactions</h1>

  <Input placeholder="Search by transaction hash" class="w-full" />

  <ScrollArea class="h-[calc(100vh-10rem)] pr-2">
    <div class="space-y-4">
      {#each data.transactions as tx (tx.hash)}
        <Card class="bg-muted">
          <CardContent class="space-y-2 p-4">
            <div class="flex items-center justify-between text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <h4>Tx: {tx.hash}</h4>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="secondary">Total TODO</Badge>
                <Badge variant="destructive">Fee -{tx.fee}</Badge>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="font-semibold">Inputs</div>
                {#each tx.inputs as input (input.outRef.hash + input.outRef.index)}
                  <div class="text-sm">
                    <a href={'/tx/' + input.outRef.hash} class="font-mono"
                      >{input.outRef.hash}#{input.outRef.index}</a
                    >
                  </div>
                {/each}
              </div>
              <div class="space-y-2">
                <div class="font-semibold">Outputs</div>
                {#each tx.outputs as output (output.outRef.index)}
                  <div class="text-sm">
                    <span class="font-mono">{output.address}</span>
                    {#if output.coin}
                      <span class="ml-2">{output.coin}</span>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  </ScrollArea>
</div>
