import { useRouter } from "next/router";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import { Modal } from "antd";
import { IWiki, IWikiObjArr } from "@/types/iRctHookForm";
import { wikiAtom } from "@/recoil/atoms/wikiData";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function Detail() {
  const router = useRouter();
  const pathId = router.asPath.split("/", 3);
  const wikiId = Number(pathId[2]);
  const wikiAtomPersist = useRecoilValue(wikiAtom);
  let titleFoundArry: any = [];
  let singleData: any;
  const [singleWikiData, setSingleWikiData] = useState<any>();
  const [allTitle, setAllTitle] = useState<string[]>();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IWiki>();
  const [wikiObjData, setWikiObjData] = useState<any>();
  const [recoilWikiAtom, setRecoilWikiAtom] =
    useRecoilState<IWikiObjArr>(wikiAtom);
  const [isEditClick, setIsEditClick] = useState(false);

  useEffect(() => {
    singleData = wikiAtomPersist.find((element) => element.id == wikiId);
    setSingleWikiData(singleData);
    let changeIntoLink: string[] = [];

    wikiAtomPersist.map((item) => {
      const titleWords = item.title.split(/\s+/); // Split the title into words
      const matchedWord = singleData?.content
        .split(/\s+/)
        .find((word: string) => {
          // Check if the word matches any of the words in the title
          return titleWords.includes(word);
        });
      if (matchedWord != null) {
        titleFoundArry.push({
          title: matchedWord,
          id: item.id,
          content: item.content,
        });
      }
    });

    setAllTitle(titleFoundArry);

    titleFoundArry?.map((item: IWiki) => {
      const linkHtml = `<a href="/detail/${item.id}">${item.title}</a>`;
      changeIntoLink.push(item.title.replace(item.title, linkHtml));
    });

    const pattern = new RegExp(
      titleFoundArry.map((item: { title: any }) => item.title).join("|"),
      "g"
    );

    // Replace the matched titles with the links
    const replaceIntoTitle = singleData?.content.replace(
      pattern,
      (match: any) => {
        const index = titleFoundArry.findIndex(
          (item: { title: string }) => item.title === match
        );
        return changeIntoLink[index];
      }
    );

    setWikiObjData({ title: singleData?.title, content: replaceIntoTitle });
  }, [wikiId, wikiAtomPersist]);

  useEffect(() => {
    if (wikiObjData) {
      setValue("title", wikiObjData.title);
      setValue("content", singleWikiData?.content);
    }
  }, [wikiObjData, singleWikiData]);

  const showModal = () => {
    setIsEditClick(true);
  };

  const handleOk = () => {
    setIsEditClick(false);
  };

  const handleCancel = () => {
    setIsEditClick(false);
  };
  const onValid = (formData: IWiki) => {
    let bakeWikiData: IWikiObjArr = [];
    wikiAtomPersist.forEach((item) => {
      if (item.id != wikiId) {
        bakeWikiData.push(item);
      }
    });

    setRecoilWikiAtom(
      [...bakeWikiData, { ...formData, id: wikiId }].sort((a, b) =>
        a.id > b.id ? 1 : -1
      )
    );
    setIsEditClick(false);
  };
  const onInvalid = (error: any) => {};

  return (
    <div>
      <div className="main">
        <div className="logo">
          <Link href="/" legacyBehavior>
            <a>
              <Image alt="social" src="/social.png" width={128} height={128} />
            </a>
          </Link>
        </div>
        <div className="content-wrap">
          <h2 className="title">{wikiObjData?.title}</h2>

          {allTitle && allTitle?.length > 0 ? (
            <div
              className="content"
              dangerouslySetInnerHTML={
                wikiObjData
                  ? { __html: wikiObjData?.content }
                  : { __html: "nothing" }
              }
            ></div>
          ) : (
            <div className="content">{singleWikiData?.content}</div>
          )}
        </div>
        <div className="btn-wrap">
          <button type="submit" className="btn-post" onClick={showModal}>
            편집
          </button>
        </div>
        <div className="title-tag-wrap">
          <div className="title-tag"># {wikiObjData?.title}</div>
          <div className="title-tag">
            {allTitle?.map((item: any, i: number) => (
              <div key={i}># {item.title}</div>
            ))}
          </div>
        </div>
        <Modal
          title="위키 수정"
          open={isEditClick}
          onOk={handleOk}
          onCancel={handleCancel}
          width={500}
          centered={true}
          footer
        >
          <form onSubmit={handleSubmit(onValid, onInvalid)}>
            <div className="modal-wrap">
              <div className="title-wrap">
                <div>Title</div>
                <input
                  disabled={true}
                  type="text"
                  autoComplete="off"
                  {...register("title", {})}
                  className="form-input"
                  placeholder="Title"
                />
              </div>

              <div>
                <div>Content</div>
                <textarea
                  maxLength={500}
                  autoComplete="off"
                  {...register("content", {
                    required: "내용을 입력해 주세요.",
                    minLength: {
                      message: "최소 10자 이상 입력해 주세요.",
                      value: 10,
                    },
                    maxLength: {
                      message: "최대 글자 수는 500자(공백 포함) 입니다.",
                      value: 500,
                    },
                  })}
                  className="text-area"
                  placeholder="입력..."
                />
                <div className="error-msg">{errors?.content?.message}</div>
              </div>
            </div>
            <div className="btn-wrap">
              <button type="submit" className="btn-post">
                등록
              </button>
            </div>
          </form>
        </Modal>
      </div>
      <style jsx>{`
        .main {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }
        .logo {
          display: flex;
          width: 100%;
          margin-top: 20px;
          justify-content: center;
          align-items: center;
        }
        .modal-wrap {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 20px;
        }
        .title-wrap {
          width: 100%;
        }
        .content-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: auto;
          max-width: 400px;
          padding: 20px;
          border-radius: 10px;
          background: #b9dffc;
        }
        .content {
          width: auto;
          white-space: pre-wrap;
        }
        .form-input {
          width: 100%;
          outline: none;
          border: 1px solid #c5c1c1;
          border-radius: 5px;
          height: 25px;
        }
        .text-area {
          width: 100%;
          height: 300px;
          resize: none;
          border: 1px solid #c5c1c1;
          border-radius: 5px;
        }
        .wiki-items-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .form-input:focus,
        .text-area:focus {
          outline: none;
        }
        .error-msg {
          height: 15px;
          margin-bottom: 10px;
          color: rgb(255, 71, 92);
          font-size: 13px;
        }
        .btn-wrap {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-post {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.4s;
          border: none;
          box-shadow: 4px 4px 12px #4f5054;
          width: 80px;
          height: 30px;
          border-radius: 3px;
          color: white;
          background: #3369aa;
          opacity: 0.8;
        }
        .btn-post:hover,
        .btn-page:hover {
          cursor: pointer;
          opacity: 1;
        }

        .link-title {
          width: auto;
          height: 63px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 20px;
          margin: 10px;
        }
        .btn-page {
          background: none;
          border: none;
          font-size: 30px;
        }
        .title-tag {
          display: flex;
          gap: 10px;
        }
        .title-tag-wrap {
          display: flex;
          gap: 10px;
          margin-top: 50px;
        }
      `}</style>
    </div>
  );
}
