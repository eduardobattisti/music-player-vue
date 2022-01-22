import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('SongItem.vue', () => {
  test('render song.displayName', () => {
    const song = {
      displayName: 'test',
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore next-line
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
      },
    });

    const compositionAuthor = wrapper.find('.text-gray-500');

    expect(compositionAuthor.text()).toBe(song.displayName);
  });

  // test('render song.docID in id attribute', () => {
  //   const song = {
  //     docID: 'abc',
  //   };

  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore next-line
  //   const wrapper = shallowMount(SongItem, {
  //     propsData: {
  //       song,
  //     },
  //     global: {
  //       components: {
  //         'router-link': RouterLinkStub,
  //       },
  //     },
  //   });

  //   console.log(wrapper.attributes());

  //   expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`);
  //   // expect(wrapper.classes()).toContain(`song-id-${song.docID}`);
  // });
});
