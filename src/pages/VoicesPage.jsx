// remove this part

import CollectionPage from "@/components/CollectionPage.jsx";
import { voiceNotes } from "@/data/siteContent.js";

export default function VoicesPage() {
  return (
    <CollectionPage
      eyebrow="Voices"
      title="Video and audio tributes that let personality come through"
      description="Some memories need tone, laughter, pauses, and spoken blessing. This page is reserved for those more intimate recordings."
      note="A later pass can embed private video links, audio players, and transcript snippets while keeping access controlled."
    >
      {voiceNotes.map((voice) => (
        <article key={voice.title} className="paper-card content-card">
          <p className="content-tag">{voice.person}</p>
          <h3 className="content-title">{voice.title}</h3>
          <p className="content-body">{voice.note}</p>
        </article>
      ))}
    </CollectionPage>
  );
}
