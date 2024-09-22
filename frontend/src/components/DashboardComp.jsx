import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiTicket } from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import {  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from 'react-chartjs-2';
// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [totalTicket, setTotalTicket] = useState(0);
  const [solved, setSolved] = useState(0);
  const [pending, setPending] = useState(0);
  const [incomplete, setIncomplete] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [self, setSelf] = useState(0);
  const [others, setOthers] = useState(0);
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`/api/leader/getTic`);
        const data = await res.json();

        if (res.ok) {
          setTotalTicket(data.length);
          setTickets(data);

          let solvedCount = 0;
          let pendingCount = 0;
          let selfer=0;
          let oth=0;

          data.forEach((ticket) => {
            if (ticket.status === "solved") {
              solvedCount++;
            } else {
              pendingCount++;
            }
            if (ticket.problemType === "self") {
              selfer++;
            } else {
              oth++;
            }
          });

          setSolved(solvedCount);
          setPending(pendingCount);
          setSelf(selfer);
          setOthers(oth);

          const twoMonthsAgo = new Date();
          twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
          const incompleteCount = data.filter(ticket => 
            ticket.status === "pending" && new Date(ticket.createdAt) < twoMonthsAgo
          ).length;
          setIncomplete(incompleteCount);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchTickets();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const data = {
    labels: ["Solved", "Pending", "Incomplete"],
    datasets: [
      {
        label: "Tickets",
        data: [solved, pending, incomplete],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const data1 = {
    labels: ["Self", "Social Service"],
    datasets: [
      {
        label: "problemTypes",
        data: [self, others],
        backgroundColor: [
         " rgba(255, 0, 0, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Count</h3>
              <p className="text-2xl">{totalTicket}</p>
            </div>
            <HiTicket className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div>
            <h3 className="text-gray-500 text-md uppercase">Total Solved</h3>
            <p className="text-2xl">{solved}</p>
            
          </div>
          <div>
            <h3 className="text-gray-500 text-md uppercase">Total Pending</h3>
            <p className="text-2xl">{pending}</p>
          </div>
        </div>
      </div>
      <div className="my-5 flex justify-around">
  <div className="flex flex-col items-center">
    <h2 className="text-lg font-semibold text-center">Ticket Status Overview</h2>
    <Bar data={data} options={{ responsive: true }} />
  </div>
  <div className="flex flex-col items-center">
    <h2 className="text-lg font-semibold text-center">Problem Type Status Overview</h2>
    <Bar data={data1} options={{ responsive: true }} />
  </div>
</div>

      
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt="user"
                      className="w-10 h-10 rounded-full bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
