"use server";

import { getUser } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { getProblems } from "@/lib/problemsClient";
import {
	BookingValues,
	DifficultyValues,
	ProblemSetQuestionList,
} from "@/lib/validations";
import { sample } from "lodash";

export async function getValidTimes(date: Date) {
	const session = await getUser();
	if (!session || !session.user) {
		throw new Error("Unauthorized");
	}

	const bookings = await prisma.booking.findMany({
		where: {
			date: {
				equals: date,
			},
			OR: [{ user1Id: session.user?.id }, { user2Id: session.user?.id }],
		},
		include: {
			user1: true,
			user2: true,
		},
	});

	const isTimeSlotAvailable = (startTime: string) => {
		return !bookings.some((booking) => {
			const bookingStart = new Date(booking.startTime);
			const bookingEnd = new Date(bookingStart.getTime() + 30 * 60000);

			const slotStart = new Date(startTime);
			const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

			return slotStart < bookingEnd && slotEnd > bookingStart;
		});
	};

	const timeSlots = [];
	const startOfDay = new Date(date);
	startOfDay.setHours(7, 0, 0, 0);

	for (let i = 0; i < 18; i++) {
		// 7:00 - 10:30
		const slot = new Date(startOfDay.getTime() + i * 30 * 60000);
		if (isTimeSlotAvailable(slot.toISOString())) {
			timeSlots.push(slot);
		}
	}

	return timeSlots;
}

export async function createBooking(values: BookingValues) {
	const session = await getUser();

	if (!session || !session.user) {
		throw new Error("Unauthorized");
	}

	const { user } = session;

	const bookings = await prisma.booking.findMany({
		where: {
			date: values.date,
			startTime: values.startTime,
			status: "PENDING",
			user2Id: null,
			user1Id: {
				not: user.id,
			},
		},
	});

	if (!bookings.length) {
		const booking = await prisma.booking.create({
			data: {
				date: values.date,
				startTime: values.startTime,
				user1Id: user.id ? user.id : "", // TODO : fix this
				difficulty: values.difficulty,
				status: "PENDING",
			},
		});
		return booking.id;
	}

	// GET problem
	const { problemsetQuestionList } = await getProblems();
	const problem1 = sample(
		getValidRandomProblem(values.difficulty, problemsetQuestionList)
	);
	const problem2 = sample(
		getValidRandomProblem(bookings[0].difficulty, problemsetQuestionList)
	);

	const booking = await prisma.booking.update({
		where: {
			id: bookings[0].id,
		},
		data: {
			user2Id: user.id,
			problem1Id: problem1?.titleSlug,
			problem2Id: problem2?.titleSlug,
			status: "ACCEPTED",
		},
	});

	return booking.id;
}

function getValidRandomProblem(
	difficulty: DifficultyValues,
	problemsetQuestionList: ProblemSetQuestionList
): ProblemSetQuestionList {
	let problems;
	switch (difficulty) {
		case "NOVICE":
			problems = problemsetQuestionList.filter(
				(problem) => problem.difficulty === "Easy"
			);
			break;

		case "INTERMEDIATE":
			problems = problemsetQuestionList.filter(
				(problem) =>
					problem.difficulty === "Medium" ||
					(problem.difficulty === "Easy" && problem.acRate < 20)
			);
			break;

		case "EXPERT":
			problems = problemsetQuestionList.filter(
				(problem) =>
					problem.difficulty === "Hard" ||
					(problem.difficulty === "Medium" && problem.acRate < 20)
			);
			break;

		default:
			problems = problemsetQuestionList;
			break;
	}

	return problems;
}
