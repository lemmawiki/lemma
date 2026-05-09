import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { Counterexample, WhyNotTaught } from "../components/meta";
import { TfIdfCooker } from "../components/widgets/tf-idf-cooker";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc2: string; arc3: string; arc5: string };

function Code({ html }: { html: string }) {
  return <div className="shiki-wrap" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Breadcrumb() {
  const { language } = useApp();
  return (
    <nav className="mt-7 font-mono text-xs tracking-[0.04em] text-ink-mute [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:text-acc">
      <Link to="/">Lemma</Link>
      <span className="mx-2 text-rule">/</span>
      <Link to="/graph">{pick(language, "graph", "그래프")}</Link>
      <span className="mx-2 text-rule">/</span>
      <span className="uppercase tracking-[0.06em] text-ink">
        {pick(language, "ml · tf-idf", "ML · TF-IDF")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · counts → bits → ranking", "도입 · 빈도 → 비트 → 순위")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>Why does Google show those results in that order?</>,
          <>구글은 왜 검색 결과를 그 순서로 보여줄까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            For thirty years the decision rule barely changed. <Term id="tf-idf">TF-IDF</Term> ranks
            documents by a score that <em>looks like</em> a sum of probabilities — and the log
            inside it is the <em>same log</em> that runs through the{" "}
            <Link
              to="/modules/entropy"
              className="border-b border-dotted text-acc no-underline hover:border-acc"
            >
              entropy module
            </Link>
            . A rare query term carries many <Term id="bit">bits</Term> of information; a common one
            carries almost none.{" "}
            <b>The score learned to ignore stopwords without anyone hard-coding the list.</b>
          </>,
          <>
            30년 동안 그 결정 규칙은 거의 안 바뀌었다. <Term id="tf-idf">TF-IDF</Term>는 확률의
            합처럼 <em>보이는</em> 점수로 문서 순위를 매긴다 — 그 안의 log는{" "}
            <Link
              to="/modules/entropy"
              className="border-b border-dotted text-acc no-underline hover:border-acc"
            >
              엔트로피 모듈
            </Link>
            을 관통하는 그 log와 같은 log다. 희귀한 쿼리 단어는 많은 <Term id="bit">비트</Term>의
            정보를 나르고, 흔한 단어는 거의 0비트.{" "}
            <b>점수는 누가 stopword 목록을 박아 넣지 않아도 그것을 무시하도록 스스로 자랐다.</b>
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            <b>Rarity is the signal.</b> Everything else is consequence.
          </>,
          <>
            <b>희귀함이 신호다.</b> 나머지는 따름정리.
          </>,
        )}
      </p>
    </section>
  );
}

function ArcRow({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[56px_1fr] gap-5 border-t border-rule py-5 max-md:grid-cols-[36px_1fr] max-md:gap-[14px]">
      <div className="font-serif text-[38px] font-medium leading-none text-acc [font-feature-settings:'lnum'] max-md:text-[28px]">
        {n}
      </div>
      <div className="min-w-0 [&_h3]:m-0 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-[-0.01em] [&_h3]:text-ink [&_p]:m-0 [&_p]:text-[16.5px] [&_p]:text-ink-soft">
        {children}
      </div>
    </div>
  );
}

function Arc({ code }: { code: CodeMap }) {
  const { language, mode } = useApp();
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "the arc", "흐름")}</div>

      <ArcRow n={1}>
        <h3>
          {pick(
            language,
            "Counting matches ranks docs by length",
            "빈도로 세면, 길이로 순위가 매겨진다",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              Search <span className={MONO}>"the cat sat"</span>. Every doc has{" "}
              <span className={MONO}>the</span>. The longest doc has it most. Counting matches ranks
              documents by how many words they contain — not by how relevant they are. We need a
              score that knows <em>which words mean something</em>.
            </>,
            <>
              <span className={MONO}>"the cat sat"</span>를 검색한다. 모든 문서에{" "}
              <span className={MONO}>the</span>가 있다. 가장 긴 문서에 가장 많이. 빈도로 세면 문서가
              포함한 단어 수로 순위가 매겨진다 — 관련성이 아니라. 우리는{" "}
              <em>어떤 단어가 의미를 가지는지</em>를 아는 점수가 필요하다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "TF — count, divided by length", "TF — 빈도, 길이로 나눈")}</h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              <Term id="term-frequency">Term frequency</Term>:{" "}
              <span className={MONO}>tf(t, d) = count(t, d) / length(d)</span>. The fraction of
              words in <span className={MONO}>d</span> that equal <span className={MONO}>t</span>.
              Without dividing by length, a long doc would win every comparison just by repeating
              every word more often. Length normalization is "level the playing field" — same
              evidence per word, regardless of how many words there are.
            </>,
            <>
              <Term id="term-frequency">단어 빈도 (term frequency)</Term>:{" "}
              <span className={MONO}>tf(t, d) = count(t, d) / length(d)</span>. 문서{" "}
              <span className={MONO}>d</span>에서 <span className={MONO}>t</span>인 단어의 비율.
              길이로 안 나누면 긴 문서가 모든 단어를 더 많이 썼다는 이유로 매번 이긴다. 길이
              정규화는 "공정한 운동장" — 단어 수와 무관하게, 단어당 같은 증거.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>{pick(language, "IDF — rarity is signal", "IDF — 희귀함이 신호다")}</h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              <Term id="inverse-document-frequency">Inverse document frequency</Term>:{" "}
              <span className={MONO}>idf(t) = log₂(N / df(t))</span>, where{" "}
              <span className={MONO}>N</span> is the corpus size and{" "}
              <Term id="document-frequency">df(t)</Term> counts how many docs contain{" "}
              <span className={MONO}>t</span>. Walk the extremes:
            </>,
            <>
              <Term id="inverse-document-frequency">역문서빈도 (inverse document frequency)</Term>:{" "}
              <span className={MONO}>idf(t) = log₂(N / df(t))</span>, 여기서{" "}
              <span className={MONO}>N</span>은 코퍼스 크기,{" "}
              <Term id="document-frequency">df(t)</Term>는 단어 <span className={MONO}>t</span>를
              포함하는 문서 수. 극단을 따라가 보자:
            </>,
          )}
        </p>
        <ul className="m-0 mb-3 list-disc pl-6 text-[16.5px] text-ink-soft [&_li]:my-1.5">
          {pick(
            language,
            <>
              <li>
                <span className={MONO}>df = N</span> (every doc has it):{" "}
                <span className={MONO}>log₂(1) = 0</span> bits. Stopword. Zero contribution.
              </li>
              <li>
                <span className={MONO}>df = 1</span> (only one doc has it):{" "}
                <span className={MONO}>log₂(N)</span> bits. Maximum signal. The query word{" "}
                <em>singles out</em> that doc.
              </li>
            </>,
            <>
              <li>
                <span className={MONO}>df = N</span> (모든 문서에 있음):{" "}
                <span className={MONO}>log₂(1) = 0</span>비트. Stopword. 기여도 0.
              </li>
              <li>
                <span className={MONO}>df = 1</span> (한 문서에만 있음):{" "}
                <span className={MONO}>log₂(N)</span>비트. 최대 신호. 그 쿼리 단어가 그 문서를{" "}
                <em>지목한다</em>.
              </li>
            </>,
          )}
        </ul>
        <p className="mb-3">
          {pick(
            language,
            <>
              In the 4-doc widget above: <span className={MONO}>"the"</span> shows up in 3 of 4
              docs, so its IDF is <span className={MONO}>log₂(4/3) ≈ 0.42</span> bits — almost
              nothing. <span className={MONO}>"fox"</span> shows up in 1 of 4, so its IDF is{" "}
              <span className={MONO}>log₂(4/1) = 2</span> bits.{" "}
              <em>The same word "fox" is worth 5× more</em> to a query than "the", and nobody
              hard-coded that.
            </>,
            <>
              위 위젯의 4-문서 코퍼스에서: <span className={MONO}>"the"</span>는 4개 중 3개에 등장,
              IDF = <span className={MONO}>log₂(4/3) ≈ 0.42</span>비트 — 거의 무. 반면{" "}
              <span className={MONO}>"fox"</span>는 4개 중 1개에만, IDF ={" "}
              <span className={MONO}>log₂(4/1) = 2</span>비트.{" "}
              <em>같은 단어 "fox"가 "the"보다 5배 가치 있다</em> — 누가 박아 넣지 않았는데도.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc3} />}
      </ArcRow>

      <ArcRow n={4}>
        <h3>
          {pick(language, "Why log? — the same log as in entropy", "왜 log? — 엔트로피의 그 log")}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              The log is not a smoothing trick. Treat <span className={MONO}>df/N</span> as "the
              probability that a random doc contains <span className={MONO}>t</span>". Then
            </>,
            <>
              log은 매끄럽게 만드는 트릭이 아니다. <span className={MONO}>df/N</span>을 "무작위
              문서가 단어 <span className={MONO}>t</span>를 포함할 확률"로 보면,
            </>,
          )}
        </p>
        <div className="my-3 rounded-md border border-rule bg-rule-soft px-5 py-4 text-center font-mono text-[15px] text-ink">
          idf(t) = log₂(N / df(t)) = −log₂ P(t) = <Term id="surprise">surprise</Term> of seeing t
        </div>
        <p className="mb-3">
          {pick(
            language,
            <>
              That is exactly the self-information from the entropy module: the bits of{" "}
              <Term id="surprise">surprise</Term> you'd feel if a random doc contained that term. A
              "surprising" word — appears in few docs — carries many bits. A "boring" word — appears
              in nearly all of them — carries near zero.{" "}
              <em>IDF is just self-information wearing a different hat.</em>
            </>,
            <>
              이건 엔트로피 모듈의 자기정보 그 자체다: 무작위 문서가 그 단어를 포함했다면 느낄{" "}
              <Term id="surprise">놀람도</Term>의 비트 수. "놀라운" 단어 (적은 문서에만 등장) 는
              많은 비트를 나르고, "지루한" 단어 (거의 모든 문서에 등장) 는 0비트에 가깝다.{" "}
              <em>IDF는 자기정보가 다른 모자를 쓴 것일 뿐이다.</em>
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The frame is heuristic — it pretends "random doc" is uniform over the corpus and that
              presence is binary. Real corpora are messier. But the intuition the frame delivers is
              rigorous, and it's the reason the log isn't going anywhere: rarity{" "}
              <em>logarithmically</em> beats frequency, every time.
            </>,
            <>
              이 프레임은 휴리스틱이다 — "무작위 문서"가 코퍼스 위 균등 분포라고, 존재는 이진이라고
              가정한다. 실제 코퍼스는 더 지저분하다. 하지만 프레임이 주는 직관은 엄밀하고, 그래서
              log은 사라지지 않는다: 희귀함은 항상 빈도를 <em>로그적으로</em> 이긴다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={5}>
        <h3>
          {pick(
            language,
            "Why product (tf × idf)? — borrowing from log-probability",
            "왜 곱하기 (tf × idf) ? — 로그-확률에서 빌려오기",
          )}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              Independent events have probabilities that{" "}
              <Link
                to="/modules/log"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                multiply
              </Link>
              ; their logs add. So if a doc had a probability for each query term independently, the
              log of the joint probability would be a clean sum:{" "}
              <span className={MONO}>Σᵢ −log P(tᵢ)</span>. TF-IDF imitates that shape:
            </>,
            <>
              독립 사건의 확률은{" "}
              <Link
                to="/modules/log"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                곱해지고
              </Link>
              , log는 더해진다. 만약 문서가 각 쿼리 단어에 대해 독립 확률을 가졌다면, 결합 확률의
              log는 깔끔한 합 <span className={MONO}>Σᵢ −log P(tᵢ)</span>가 된다. TF-IDF는 이 모양을
              흉내낸다:
            </>,
          )}
        </p>
        <div className="my-3 rounded-md border border-rule bg-rule-soft px-5 py-4 text-center font-mono text-[15px] text-ink">
          score(q, d) = Σ<sub>t ∈ q</sub> tf(t, d) · idf(t)
        </div>
        <p className="mb-3">
          {pick(
            language,
            <>
              <b>But the imitation is not the thing.</b> <span className={MONO}>tf</span> is a
              count, not a probability. Multiplying it by <span className={MONO}>idf</span> is{" "}
              <em>not</em> literally taking the log of a joint probability. TF-IDF is a useful
              ranking score that <em>borrows</em> the "logs of independent probabilities add" shape
              — not a real likelihood. Treat it as a heuristic motivated by information theory; that
              is exactly the right amount of trust to give it.
            </>,
            <>
              <b>그러나 흉내는 진짜가 아니다.</b> <span className={MONO}>tf</span>는 빈도지 확률이
              아니다. 그걸 <span className={MONO}>idf</span>와 곱한다고 결합 확률의 log를 문자
              그대로 취하는 건 <em>아니다</em>. TF-IDF는 "독립 확률들의 log는 더해진다"는 모양을{" "}
              <em>빌려온</em> 유용한 순위 점수지, 진짜 가능도가 아니다. 정보이론에서 영감받은
              휴리스틱으로 다루는 것 — 정확히 그만큼의 신뢰가 옳다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc5} />}
      </ArcRow>

      <ArcRow n={6}>
        <h3>
          {pick(
            language,
            "The vector view — cosine, not Euclidean",
            "벡터의 관점 — 코사인, 유클리드 아님",
          )}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              Pin a column for every word in the vocabulary. Each doc becomes a{" "}
              <Term id="vector">vector</Term> of TF-IDF weights — mostly zeros, a few non-zeros
              where the doc actually uses those words. (This sparse-vector representation is called{" "}
              <Term id="bag-of-words">bag of words</Term>: it keeps frequencies but throws away
              order.) The query is the same kind of vector. Ranking docs becomes "find the
              doc-vectors closest to the query-vector".
            </>,
            <>
              어휘의 모든 단어에 열을 하나씩 박는다. 각 문서는 TF-IDF 가중치의{" "}
              <Term id="vector">벡터</Term>가 된다 — 대부분 0, 그 문서가 실제로 쓰는 몇 개 단어
              자리에서만 0이 아닌 값. (이 희소 벡터 표현이{" "}
              <Term id="bag-of-words">bag of words (BoW)</Term>다: 빈도는 보존하고 순서는 버린다.)
              쿼리도 같은 종류의 벡터. 순위 매기기는 "쿼리 벡터에 가장 가까운 문서 벡터들 찾기"가
              된다.
            </>,
          )}
        </p>
        <p className="mb-3">
          {pick(
            language,
            <>
              Why <Term id="cosine-similarity">cosine similarity</Term>, not Euclidean distance?
              Because doc length should not move the score. Take a doc{" "}
              <span className={MONO}>d</span> and its concatenation with itself,{" "}
              <span className={MONO}>d ++ d</span>: the second has every component doubled — a
              vector pointing the same direction, twice as long. Cosine of the angle between the
              two: <span className={MONO}>1</span> (identical direction). Euclidean distance:{" "}
              <span className={MONO}>‖d‖</span> (non-zero).{" "}
              <em>Doubling a doc shouldn't change its meaning</em>; cosine is the metric that
              agrees.
            </>,
            <>
              왜 <Term id="cosine-similarity">코사인 유사도</Term>지, 유클리드 거리가 아니고? 문서
              길이가 점수를 움직이면 안 되기 때문. 문서 <span className={MONO}>d</span>와 자기
              자신을 이어 붙인 <span className={MONO}>d ++ d</span>를 보자: 후자는 모든 성분이 두 배
              — 같은 방향, 두 배 긴 벡터. 두 벡터 사이 각의 코사인: <span className={MONO}>1</span>{" "}
              (같은 방향). 유클리드 거리: <span className={MONO}>‖d‖</span> (0이 아님).{" "}
              <em>문서를 두 배로 늘렸다고 의미가 바뀌면 안 된다</em>; 코사인은 그것에 동의하는
              지표다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={7}>
        <h3>
          {pick(
            language,
            "Why this became the paradigm — and what came after",
            "왜 이게 패러다임이 됐고, 그 다음엔 무엇이 왔는가",
          )}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              TF-IDF won three races at once. It was <em>fast</em> (sparse vectors, inverted index),{" "}
              <em>scalable</em> (web-sized corpora fit in commodity hardware), and{" "}
              <em>interpretable</em> (every score has a per-term breakdown — exactly what the widget
              shows). It also produced rankings that were hard to embarrass: the model has one
              strong assumption (term independence) and a probability-flavored intuition, and the
              failure modes were familiar.
            </>,
            <>
              TF-IDF는 세 경주에서 동시에 이겼다. <em>빠르고</em> (희소 벡터, 역색인),{" "}
              <em>확장되고</em> (웹 규모 코퍼스가 평범한 하드웨어에 들어가고),{" "}
              <em>해석 가능했다</em> (모든 점수에 단어별 내역이 있다 — 위젯이 보여주는 그것). 순위도
              망신스럽지 않았다: 강한 가정 하나 (단어 독립) 와 확률 향의 직관 위에 서 있어서 실패
              모드가 익숙했다.
            </>,
          )}
        </p>
        <p className="mb-3">
          {pick(
            language,
            <>
              <Term id="bm25">BM25</Term> = TF-IDF + two empirical patches. (a) <em>Saturation</em>:
              the 5th occurrence shouldn't count as much as the 1st;{" "}
              <span className={MONO}>tf</span> is replaced by{" "}
              <span className={MONO}>(k₁+1)·tf / (k₁+tf)</span>, saturating around{" "}
              <span className={MONO}>k₁ ≈ 1.2</span>. (b) <em>Length normalization</em>: docs longer
              than the average get their tf damped further. Both patches were tuned on TREC
              evaluations in the 1990s and stayed.
            </>,
            <>
              <Term id="bm25">BM25</Term> = TF-IDF + 경험적 보정 두 개. (a) <em>포화</em>: 다섯 번째
              출현이 첫 번째만큼 중요하진 않아야 한다; <span className={MONO}>tf</span>를{" "}
              <span className={MONO}>(k₁+1)·tf / (k₁+tf)</span>로 바꿔{" "}
              <span className={MONO}>k₁ ≈ 1.2</span> 근처에서 포화. (b) <em>길이 정규화</em>:
              평균보다 긴 문서는 tf를 더 깎는다. 둘 다 1990년대 TREC 평가에서 튜닝되어 살아남았다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The bridge to ML: TF-IDF was the first feature vector for text. Naive Bayes
              classifiers, logistic regression on text, latent semantic analysis — all stand on this
              representation. Modern dense neural retrievers (DPR, ColBERT, the dual-encoder family)
              replaced sparse TF-IDF vectors with dense embeddings, but{" "}
              <em>they still benchmark against BM25</em>. A new method that doesn't beat the
              30-year-old baseline on a real retrieval task is not a new method. The log is still
              there.
            </>,
            <>
              ML로의 다리: TF-IDF는 텍스트의 첫 번째 특징 벡터였다. 나이브 베이즈, 텍스트 위
              로지스틱 회귀, 잠재 의미 분석 — 모두 이 표현 위에 선다. 현대 신경 밀집 검색기 (DPR,
              ColBERT, 듀얼 인코더 계열) 는 희소 TF-IDF 벡터를 밀집 임베딩으로 교체했지만,{" "}
              <em>여전히 BM25를 베이스라인으로 비교한다</em>. 실제 검색 과제에서 30년 된
              베이스라인을 못 이기는 새 방법은 새 방법이 아니다. log은 여전히 거기 있다.
            </>,
          )}
        </p>
        <Counterexample
          en={
            <>
              The independence assumption sometimes lies. A query for{" "}
              <span className={MONO}>"new york"</span> on a TF-IDF index returns docs that contain{" "}
              <em>either</em> "new" or "york" with high score, including docs about{" "}
              <em>new things</em> in <em>York, England</em>. TF-IDF cannot tell that "new york" is
              one thing. Phrase matching, n-grams, and (eventually) dense embeddings are how search
              engines patched this — none of them removed TF-IDF, they layered on top.
            </>
          }
          ko={
            <>
              독립 가정이 가끔 거짓말을 한다. TF-IDF 색인에 <span className={MONO}>"new york"</span>
              으로 쿼리를 던지면 "new"나 "york" 어느 쪽이든 높은 점수의 문서를 반환한다 —{" "}
              <em>York, England에서의 새로운 일들</em>에 대한 문서까지 포함해서. TF-IDF는 "new
              york"이 하나의 것이라는 걸 알지 못한다. 구절 매칭, n-그램, (최종적으로) 밀집 임베딩이
              검색엔진들이 이걸 기운 방법이다 — 어느 것도 TF-IDF를 *제거*하진 않았고, 그 위에
              쌓였다.
            </>
          }
        />
      </ArcRow>
    </section>
  );
}

function Pin() {
  const { language } = useApp();
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "pin this", "핀")}</div>
      <p className="m-0 max-w-[680px] border-l-[3px] border-acc-deep pl-5 font-serif text-[22px] italic leading-[1.45] text-ink [&_b]:not-italic [&_b]:font-semibold">
        {pick(
          language,
          <>
            <b>The search score behaves like a sum of bits.</b> Common words give near zero, rare
            words give many. The log is not a trick — it is the unit of information. But{" "}
            <b>tf × idf is not literally a sum of bits</b>; it is a heuristic that borrows the shape
            from log-probability. That borrowed shape ran the web for thirty years, and still
            defines what every neural retriever has to beat.
          </>,
          <>
            <b>검색 점수는 비트의 합처럼 행동한다.</b> 흔한 단어는 0에 가깝게, 희귀한 단어는 많이.
            log는 트릭이 아니라 정보의 단위다. 하지만 <b>tf × idf는 비트의 합 그 자체는 아니다</b>;
            로그-확률에서 모양을 빌려온 휴리스틱이다. 그 빌려온 모양이 30년간 웹을 돌렸고, 지금도
            모든 신경 검색기가 넘어야 할 기준선을 정의한다.
          </>,
        )}
      </p>
    </section>
  );
}

function Exercises() {
  return (
    <section className="mt-14">
      <div className={KICKER}>exercises · 손으로 풀기</div>

      <Exercise
        number={1}
        tag={{ en: "read the widget", ko: "위젯 읽기" }}
        prompt={{
          en: (
            <>
              In the widget, search <span className={MONO}>the</span> with the <b>raw count</b>{" "}
              ranking. Which doc wins, and why? Now switch to <b>TF-IDF</b>. What happens to the
              ranking, and what does the IDF panel say about <span className={MONO}>"the"</span>?
            </>
          ),
          ko: (
            <>
              위젯에서 <span className={MONO}>the</span>를 <b>원시 빈도</b> 순위로 검색. 어느 문서가
              이기고, 왜? 이제 <b>TF-IDF</b>로 전환. 순위는 어떻게 변하고, IDF 패널은{" "}
              <span className={MONO}>"the"</span>에 대해 무엇을 말하나?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Raw count: doc 1 ("the cat sat on the mat") wins with count 2. Under TF-IDF, every
              doc's score collapses toward zero — the IDF of "the" is{" "}
              <span className={MONO}>log₂(4/3) ≈ 0.42</span> bits, so even doc 1's contribution is{" "}
              <span className={MONO}>(2/6) · 0.42 ≈ 0.14</span>. The widget visibly de-emphasizes
              the "stopword winner".{" "}
              <em>The score learned to ignore "the" without anyone telling it to.</em>
            </>
          ),
          ko: (
            <>
              원시 빈도: 문서 1 ("the cat sat on the mat") 이 빈도 2로 이긴다. TF-IDF에서는 모든
              문서의 점수가 0 쪽으로 무너진다 — "the"의 IDF는{" "}
              <span className={MONO}>log₂(4/3) ≈ 0.42</span>비트, 그래서 문서 1의 기여도조차{" "}
              <span className={MONO}>(2/6) · 0.42 ≈ 0.14</span>에 불과. 위젯은 "stopword 승자"를
              눈에 띄게 깎아낸다. <em>누가 시키지 않았는데 점수가 "the"를 무시하도록 자랐다.</em>
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "compute by hand · TF-IDF", ko: "손으로 계산 · TF-IDF" }}
        prompt={{
          en: (
            <>
              For the 4-doc corpus in the widget and query <span className={MONO}>cat</span>:
              compute (a) <span className={MONO}>tf(cat, d)</span> for each doc, (b){" "}
              <span className={MONO}>idf(cat)</span>, (c) the TF-IDF score for each doc. Which doc
              wins, and is it the longer or the shorter cat-containing doc?
            </>
          ),
          ko: (
            <>
              위젯의 4-문서 코퍼스와 쿼리 <span className={MONO}>cat</span>에 대해: (a) 각 문서의{" "}
              <span className={MONO}>tf(cat, d)</span>, (b) <span className={MONO}>idf(cat)</span>,
              (c) 각 문서의 TF-IDF 점수를 계산. 어느 문서가 이기고, cat을 포함한 두 문서 중 더 긴
              쪽인가 짧은 쪽인가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Lengths: doc 1 = 6, doc 2 = 4, doc 3 = 5, doc 4 = 4. Cat appears in docs 1 and 3, so
              df = 2 and idf = <span className={MONO}>log₂(4/2) = 1</span> bit. tf values:{" "}
              <span className={MONO}>{"{1/6, 0, 1/5, 0}"}</span>. Scores:{" "}
              <span className={MONO}>{"{0.167, 0, 0.2, 0}"}</span>. <b>Doc 3 wins</b> — the shorter
              of the two cat-docs. Length normalization picks the doc that's "more about cat per
              word".
            </>
          ),
          ko: (
            <>
              길이: 문서 1 = 6, 문서 2 = 4, 문서 3 = 5, 문서 4 = 4. cat은 문서 1과 3에 등장, df = 2,
              idf = <span className={MONO}>log₂(4/2) = 1</span>비트. tf 값:{" "}
              <span className={MONO}>{"{1/6, 0, 1/5, 0}"}</span>. 점수:{" "}
              <span className={MONO}>{"{0.167, 0, 0.2, 0}"}</span>. <b>문서 3이 이긴다</b> — cat이
              있는 두 문서 중 더 짧은 쪽. 길이 정규화는 "단어당 cat의 비중이 더 큰" 문서를 고른다.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "predict · adding a duplicate", ko: "예측 · 사본 추가" }}
        prompt={{
          en: (
            <>
              Imagine we add 100 copies of doc 1 ("the cat sat on the mat") to the corpus, growing N
              from 4 to 104. For the query <span className={MONO}>cat</span>: predict (without
              recomputing) what happens to (a) idf(cat), (b) the score of doc 3 ("cat and dog are
              friends"), (c) the ranking of doc 3 vs the (now numerous) copies of doc 1.
            </>
          ),
          ko: (
            <>
              문서 1 ("the cat sat on the mat") 의 사본 100개를 코퍼스에 더해 N이 4 → 104가 됐다고
              상상하자. 쿼리 <span className={MONO}>cat</span>에 대해 (다시 계산하지 말고) 예측: (a)
              idf(cat) 은 어떻게 변하나, (b) 문서 3 ("cat and dog are friends") 의 점수는, (c) 문서
              3과 (이제 많아진) 문서 1 사본들의 순위는?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              df(cat) goes from 2 to 102 (every duplicate also contains cat); N goes 4 → 104. So{" "}
              <span className={MONO}>idf(cat) = log₂(104/102) ≈ 0.028</span> bits — collapsed to
              near zero. Doc 3's score: tf unchanged, idf collapsed, so total score collapses
              proportionally. <em>The ranking flattens</em> — once everything contains "cat", "cat"
              stops being a useful query word. The corpus determined the meaning of the query, not
              the doc. (This is also why search results from a niche corpus rank differently than
              the same query on the open web.)
            </>
          ),
          ko: (
            <>
              df(cat) 은 2에서 102로 (사본도 cat을 포함); N은 4 → 104. 그래서{" "}
              <span className={MONO}>idf(cat) = log₂(104/102) ≈ 0.028</span>비트 — 거의 0으로
              무너짐. 문서 3의 점수: tf는 그대로, idf가 무너지므로 총점도 비례해서 무너진다.{" "}
              <em>순위가 평평해진다</em> — 모든 게 "cat"을 포함하면, "cat"은 더 이상 쓸모 있는 쿼리
              단어가 아니다. 쿼리의 의미를 정한 건 문서가 아니라 코퍼스다. (좁은 코퍼스의 검색
              결과가 같은 쿼리의 오픈 웹 결과와 다른 이유이기도 하다.)
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "the evil one · zero signal", ko: "사악한 것 · 신호 0" }}
        prompt={{
          en: (
            <>
              Suppose a query word appears in <em>literally every doc</em> in the corpus. Compute
              its IDF and explain why the score for that word, on every doc, is exactly zero. Then:
              write a one-sentence explanation of why this matches intuition (rather than being a
              bug).
            </>
          ),
          ko: (
            <>
              어떤 쿼리 단어가 코퍼스의 <em>모든 문서</em>에 등장한다고 하자. IDF를 계산하고, 모든
              문서에서 그 단어의 점수가 정확히 0인 이유를 설명. 그리고: 이게 버그가 아니라 직관과
              일치하는 이유를 한 문장으로 써라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>df = N</span>, so{" "}
              <span className={MONO}>idf = log₂(N/N) = log₂(1) = 0</span>. Every term's contribution{" "}
              <span className={MONO}>tf · idf = 0</span>. The intuition: a word in every doc carries
              no information about <em>which</em> doc you want — it's the worst possible answer to
              the question "which doc is this query about?". TF-IDF made that "worst possible" be
              exactly zero, which is what self-information also says:{" "}
              <span className={MONO}>−log₂ 1 = 0</span> bits of surprise.{" "}
              <em>Stopwords aren't a list — they're the zero set of a function.</em>
            </>
          ),
          ko: (
            <>
              <span className={MONO}>df = N</span>이라서{" "}
              <span className={MONO}>idf = log₂(N/N) = log₂(1) = 0</span>. 모든 단어의 기여도{" "}
              <span className={MONO}>tf · idf = 0</span>. 직관: 모든 문서에 있는 단어는{" "}
              <em>어느</em> 문서를 원하는지에 대해 정보를 0만큼 나른다 — "이 쿼리는 어느 문서에 관한
              거냐?" 라는 질문의 최악의 답이다. TF-IDF는 그 "최악"을 정확히 0으로 정했고, 자기정보도
              같은 말을 한다: <span className={MONO}>−log₂ 1 = 0</span>비트의 놀람도.{" "}
              <em>Stopword는 목록이 아니라, 어떤 함수의 영점이다.</em>
            </>
          ),
        }}
      />
    </section>
  );
}

function GlossaryList() {
  const { language } = useApp();
  const registry = useTermsRegistry();
  const used = registry?.used;
  const visible = used ? glossary.filter((g) => used.has(g.id)) : glossary;
  if (visible.length === 0) return null;
  return (
    <section className="mt-14">
      <div className={KICKER}>
        {pick(
          language,
          `glossary · used on this page · ${visible.length}`,
          `용어집 · 이 페이지에서 쓰임 · ${visible.length}`,
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
        {visible.map((g) => {
          const en = g.locales.en;
          const ko = g.locales.ko;
          const view = g.locales[language] ?? en;
          return (
            <div
              key={g.id}
              className="rounded-md border border-rule bg-bg-card px-4 py-3.5 text-[14.5px] leading-[1.5]"
            >
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="font-serif text-base font-semibold text-ink">
                  {en?.term ?? g.id}
                </span>
                <span className="text-ink-mute">·</span>
                <span className="font-sans text-[15px] font-medium text-acc">
                  {ko?.term ?? g.id}
                </span>
              </div>
              <div className="text-ink-soft">{view?.body}</div>
              {view?.flag && (
                <div className="mt-2 border-t border-dashed border-rule pt-2 text-[13px] text-acc-deep">
                  ⚠ {view.flag}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function TfIdf({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "TF-IDF · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <TfIdfCooker />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <WhyNotTaught
        en={
          <>
            IR textbooks usually present TF-IDF as a sequence of definitions: tf, then idf, then
            their product, then cosine. The product gets a sentence ("we multiply because that's the
            formula"). Lemma keeps the product honest:{" "}
            <em>tf × idf is not a log probability — it borrows that shape</em>. Hiding that
            distinction is what makes "why log?" feel like a trick rather than a unit of
            information.
          </>
        }
        ko={
          <>
            정보검색 교과서는 보통 TF-IDF를 정의의 나열로 보여준다: tf, idf, 곱, 코사인. 곱은 한
            문장으로 처리된다 ("그게 공식이라서 곱한다"). Lemma는 곱을 정직하게 다룬다:{" "}
            <em>tf × idf는 로그 확률이 아니다 — 그 모양을 빌려왔을 뿐이다</em>. 이 구분을 숨기는
            것이 "왜 log?"를 정보의 단위가 아닌 트릭처럼 느끼게 만든다.
          </>
        }
      />
      <GlossaryList />
    </TermsProvider>
  );
}
