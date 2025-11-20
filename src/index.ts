import { SiApiClient } from './client';
import { loadFromFile, saveToFile } from './lib/scriptable';

async function main() {
  // const data = await loadFromFile('sb.json', true);
  const si = new SiApiClient();
  // si.state.deserialize(data);
  // try {
  let feed = si.feed.cards({
    searchTypeCode: 1,
    keyword: '3104106959000158',
  });

  /* test 1
  feed.items$.subscribe({
    next: (cs) => {
      const myCard = cs[0];
      console.log(myCard.toJSON());
      Promise.resolve().then(async () => await QuickLook.present(myCard.toJSON()));
    }
  }); */

  /* test 2 */
  const cards = await feed.items();
  const myCard = cards[0];
  console.log(myCard.toJSON());
  await QuickLook.present(myCard.toJSON());

  const catalog = await myCard.catalog();
  await QuickLook.present(catalog);

  const details = await myCard.detail();
  await QuickLook.present(details);

  const owner = await myCard.owner();
  await QuickLook.present(owner);

  const parent = await myCard.parent();
  await QuickLook.present(parent);

  const commission = await myCard.commission();
  await QuickLook.present(commission);

  const countTotalAppendix = await myCard.countTotalAppendix();
  await QuickLook.present(countTotalAppendix);

  //myCard.
  //  } catch (e) {
  //   console.error(e);
  //  } finally {
  //   log(saveToFile('sb.json', si.state.serialize()));
  // }
}
main().catch((e) => {
  throw e;
});
