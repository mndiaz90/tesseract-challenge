import { ChangeEvent, useEffect, useState } from "react";
import { HeaderCmp } from "../components/HeaderCmp";
import styles from '../styles/Home.module.css';

interface Dados {
    dados: Array<Member>
}

interface Member {
    login: string,
    name: string,
    avatar_url: string,
    public_repos: number,
    followers: number,
    created_at: Date,
}

export default function HomePage(props: Dados) {
    const [arrayMembers, setArrayMembers] = useState<[Member] | any>(props.dados);
    const [notFound, setNotFound] = useState(false);
    const [pesquisar, setPesquisar] = useState<string>("");

    function onChangePesquisar(e: ChangeEvent<HTMLInputElement>) {
        setPesquisar(e.currentTarget.value)
    }

    function pesquisarUser() {
        if (pesquisar.length) {
            let membersFinded = props.dados.filter(member => member.login.toLowerCase().includes(pesquisar.toLowerCase()));
            if (membersFinded.length) {
                setArrayMembers(membersFinded)
                setNotFound(false)
            } else {
                setNotFound(true)
            }
        } else {
            setArrayMembers(props.dados)
        }
    }

    useEffect(() => {
        pesquisarUser()
    }, [pesquisar])

    return <div className={styles.containerPrincipal}>
        <HeaderCmp />
        <h3>Membros do Tesseract no github</h3>
        <div className={styles.containerInput}>
            <input
                type="text"
                name="pesquisar"
                onChange={onChangePesquisar}
                placeholder="Digite o usuário a pesquisar"
            />
        </div>

        {notFound ? <div><h2>Nao foi encontrado o usuário</h2></div> :
            <ul className={styles.gridMember}>
                {arrayMembers.map((member: Member, index: number) => {
                    return <li key={index}>
                        <img className={styles.imgProfile} src={member.avatar_url} alt="imgProfile" />
                        {member.login}
                    </li>
                })}
            </ul>
        }
    </div>
}

HomePage.getInitialProps = async () => {
    const response = await fetch('https://api.github.com/orgs/grupotesseract/public_members')
    const json = await response.json()
    return {
        dados: json
    }
}