import { wikiAtom } from "@/recoil/atoms/wikiData";
import { IWiki, IWikiObjArr } from "@/types/iRctHookForm";
import { Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";

// let IWikiData: IWikiObjArr | null = [];
// let count = 0;
export default function Home() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IWiki>();
  const [isAddClick, setIsAddClick] = useState(false);
  // const [recoilWikiAtom, setrecoilWikiAtom] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const wikiAtomPersist = useRecoilValue(wikiAtom);

  const [test, setTest] = useState<IWikiObjArr>();
  const [dataCount, setDataCount] = useState<number>();
  const [recoilWikiAtom, setRecoilWikiAtom] =
    useRecoilState<IWikiObjArr>(wikiAtom);

  useEffect(() => {
    setDataCount(wikiAtomPersist.length);
    setTest(wikiAtomPersist.slice(indexOfFirstItem, indexOfLastItem));
  }, [recoilWikiAtom, currentPage]);

  const showModal = () => {
    setIsAddClick(true);
  };

  const handleOk = () => {
    setIsAddClick(false);
  };

  const handleCancel = () => {
    setIsAddClick(false);
  };

  const onValid = (formData: IWiki) => {
    setRecoilWikiAtom((prevData) => [
      ...prevData,
      { ...formData, id: prevData.length },
    ]);
    setIsAddClick(false);
    reset();
  };
  const onInvalid = (error: any) => {};

  const handleNextPage = () => {
    setCurrentPage((prevCurrentPage) => prevCurrentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevCurrentPage) => prevCurrentPage - 1);
  };

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
        <button className="btn-post" onClick={showModal}>
          추가
        </button>
        <Modal
          title="위키 등록"
          open={isAddClick}
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
                  type="text"
                  autoComplete="off"
                  {...register("title", {
                    required: "제목을 입력해주세요",
                    minLength: {
                      message: "최소 3자 이상 입력해 주세요.",
                      value: 3,
                    },
                    maxLength: {
                      message: "최대 글자 수는 10자 입니다.",
                      value: 10,
                    },
                    validate: {
                      noSpace: (value) =>
                        !value.includes(" ") || "공백 없이 입력해 주세요.",
                      duplicate: (value) =>
                        (Array.isArray(wikiAtomPersist) &&
                          !wikiAtomPersist.find(
                            (element) => element.title === value
                          )) ||
                        "이미 등록된 위키 정보 입니다.",
                    },
                  })}
                  className="form-input"
                  placeholder="Title"
                />
                <div className="error-msg">{errors?.title?.message}</div>
              </div>

              <div className="content-wrap">
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

        <div className="wiki-items-wrap">
          <button
            className="btn-page"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <div className="link-title">
            {test?.map((item: IWiki, i: number) => (
              <Link href={`/detail/${item?.id}`} legacyBehavior key={i}>
                <a className="logo-content">{item?.title}</a>
              </Link>
            ))}
          </div>
          <button
            className="btn-page"
            onClick={handleNextPage}
            disabled={dataCount ? indexOfLastItem >= dataCount : true}
          >
            &gt;
          </button>
        </div>
        <span>Total : {dataCount} 개</span>
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
          width: 100%;
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
      `}</style>
    </div>
  );
}
