import Image from "next/image";

const HERO = "/products/raft/hero-scan-poster.jpg";
const THUMBS = [
  "/products/raft/shelf-oos.png",
  "/products/raft/shelf-facing.png",
  "/products/raft/sku-recognition.png",
] as const;

export function RaftMedia({ priority = false }: { priority?: boolean }) {
  return (
    <div className="dyas-raft-media">
      <div className="dyas-raft-media__hero">
        <Image
          src={HERO}
          alt=""
          width={1200}
          height={900}
          className="dyas-raft-media__hero-img"
          sizes="(max-width: 900px) 100vw, 50vw"
          priority={priority}
        />
      </div>
      <div className="dyas-raft-media__strip">
        {THUMBS.map((src) => (
          <div key={src} className="dyas-raft-media__thumb">
            <Image src={src} alt="" width={480} height={360} sizes="200px" />
          </div>
        ))}
      </div>
    </div>
  );
}
